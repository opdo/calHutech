function cal() {
    var totalCredits = $("#edtYear").val();
    var credits = $("#edtCredits").val();
    var gpa = $("#edtGPA").val();
    var type = $("#edtType").val();

    // kiểm tra các ràng buộc của input
    if (totalCredits.length < 1 || credits.length < 1 || gpa.length < 1 || type.length < 1) {
        alert("Vui lòng điền đầy đủ các thông tin bên trên");
        return;
    }

    // parse về kiểu int
    try {
        credits = parseInt(credits);
        totalCredits = parseInt(totalCredits);
        type = parseFloat(type);
        gpa = parseFloat(gpa);
    }
    catch {
        alert("Điểm toàn khóa hoặc số tín chỉ không đúng định dạng số");
        return;
    }

    if (totalCredits < credits || credits < 0) {
        alert("Số tín chỉ không hợp lệ");
        return;
    }

    if (gpa > 4 || gpa < 0) {
        alert("Điểm trung bình toàn khóa không hợp lệ");
        return;
    }
    // làm tròn đến chữ số thập phân thứ hai
    gpa = Math.round(gpa * 100) / 100;
    // số tín chỉ còn lại cần học
    var leftCredits = totalCredits - credits;
    // tổng điểm hệ 4 hiện tại * tín chỉ hiện tại
    var currentSumproduct = credits * gpa;
    // điểm hệ 4 cần để đạt được mục tiêu
    var point = (type * totalCredits - currentSumproduct) / leftCredits;
    // làm tròn đến chữ số thập phân thứ nhất
    point = Math.round(point * 10) / 10;
    // làm tròn đến 0.5
    var oldPoint = point;
    point = Math.round(point * 2) / 2;
    // kiểm tra điểm làm tròn có thỏa điều kiện hay ko
    var flagOldPoint = Math.round(((point * leftCredits + gpa * credits)/totalCredits)*100)/100 >= type;
    // lấy phần lẻ + 0.5 nếu điều kiện ko thỏa
    if (!flagOldPoint) point += oldPoint > point ? 0.5 : 0;
    // tạo thành mảng
    point *= 2;

    var txtResult = $("#txtResult");
    var txtDetail = $("#txtDetail");

    var needPoint = ['F', 'F+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A'];
    if (point > needPoint.length) {
        txtResult.html("Rất tiếc, bạn không thể đạt mục tiêu");
        txtDetail.html("Hệ thống tính toán cho thấy, bạn không thể hoàn thành mục tiêu đặt ra");
    }
    else if (point < 2) {
        txtResult.html("Chúc mừng, bạn chỉ cần không rớt môn");
        txtDetail.html("Bạn đã đạt được mục tiêu đề ra, chỉ cần bạn không rớt môn là sẽ ổn");
    }
    else {
        var charPoint = needPoint[point];
        txtResult.html("Các môn còn lại cần đạt ít nhất " + charPoint);
        var leftSubject = Math.round(leftCredits / 3);
        txtDetail.html("Với " + leftCredits + " chỉ còn lại (khoảng " + leftSubject + " môn học), bạn chỉ cần đạt hệ 4 với <b>trung bình điểm " + charPoint + "</b>, một môn dưới điểm " + charPoint + (charPoint == 'A' ? " thì bạn sẽ mất cơ hội" : " cần đánh đổi với một môn trên điểm " + charPoint));
    }

    // tính số tín chỉ không nên vượt qua
    var helloCredits = Math.floor(totalCredits * 0.05);
    $("#helloCredits").html(helloCredits);

    // return về kết quả
    $("#divCal").hide();
    $("#divResult").show();
}

function back() {
    $("#divResult").hide();
    $("#divCal").show();
}