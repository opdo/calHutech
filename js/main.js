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
    var fPoint = (type * totalCredits - currentSumproduct) / leftCredits;
    // làm tròn đến chữ số thập phân thứ nhất
    var point  = Math.round(fPoint * 10) / 10;
    // làm tròn đến 0.5
    point = Math.round(point  * 2) / 2;
    // kiểm tra điểm làm tròn có thỏa điều kiện hay ko
    var flagfPoint = Math.round(((point * leftCredits + gpa * credits)/totalCredits)*100)/100 >= type;
    // lấy phần lẻ + 0.5 nếu điều kiện ko thỏa
    if (!flagfPoint) point += fPoint > point ? 0.5 : 0;
    // tạo thành mảng
    point *= 2;

    var txtResult = $("#txtResult");
    var txtDetail = $("#txtDetail");
    var tablePoint = $("#tablePoint");
    tablePoint.hide();

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
        // pp tính lẻ số môn
        var fNeedPoint = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        var cNeedPoint = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        cNeedPoint[point] = leftCredits;
        // giảm chỉ từ từ (mỗi lần 3 chỉ) cho đến khi không còn giảm được nữa
        var i = point;
        while (true)
        {
            // điều kiện vị trí chuyển chỉ >= 3
            if (i < 3) break;
            // điều kiện vị trí giảm chỉ không được ít hơn 3 chỉ
            if (cNeedPoint[i] < 3) break;
            // giảm và chuyển chỉ
            cNeedPoint[i] -= 3;
            cNeedPoint[i-1] += 3;

            // điều kiện tổng điểm hiện tại phải >= điểm cần đạt fPoint
            if (calTotalPoint(cNeedPoint) < fPoint) {
                // ăn gian quy tắc làm tròn
                var fCheatPoint = (calTotalPoint(cNeedPoint)*leftCredits + currentSumproduct)/totalCredits;
                
                var cheatPoint = Math.round(fCheatPoint*100)/100;
                if (cheatPoint >= type) {
                    $("#myPoint").html(fCheatPoint);
                    continue;
                }

                // trả lại giá trị cũ
                cNeedPoint[i] += 3;
                cNeedPoint[i-1] -= 3;
                // tiếp tục chuyển chỉ, đổi i nếu i >= 3
                if (i < 3) {
                    break;
                }
                else {
                    i--;
                }
            }
        }
        // hiện table point
        tablePoint.show();
        var tablePointBody = $("#tablePointBody");
        var html = "";
        for (i in cNeedPoint) {
            var credits = cNeedPoint[i];
            if (credits == 0) continue;
            
            var leftSubject = Math.round(credits / 3);
            html += createHtmlRow(needPoint[i], credits + " (khoảng "+leftSubject+" môn)");
        }
        tablePointBody.html(html);

        txtResult.html("Cố gắng lên nhé!");
        txtDetail.html("Với " + leftCredits + " chỉ còn lại, công cụ của chúng tôi đề xuất phân phối điểm của bạn như bảng bên dưới, xin lưu ý công cụ này giả định 1 môn học tương đương với 3 chỉ");
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

function calTotalPoint(lCredit)
{
    var point = 0;
    var sumCredits = 0;
    try{
        var fListPoint = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        var i = 0;
        for (i in lCredit) {
            var credits = lCredit[i];
            sumCredits+= credits;
            point += fListPoint[i]*credits;
        }
        point = point/sumCredits;
    }
    catch {

    }
    return point;
}

function createHtmlRow(col1, col2)
{
    var html = "";
    html = "<tr><th>"+col1+"</th><td>"+col2+"</td></tr>";
    return html;
}