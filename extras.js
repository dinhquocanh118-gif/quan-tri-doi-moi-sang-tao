/* Case study và lộ trình học tập.
   Thêm ảnh cho một case: đặt file vào thư mục  rồi thêm  img: "ten-file.jpg"  như case Apple. */
window.CASES = [
  { ch: 1, name: "Apple", img: "case-apple.jpg", tag: "Thành công", ok: true, title: "Thiết kế và tầm nhìn thị trường",
    context: "Sau giai đoạn sa sút ở thập niên 1990, Apple trở lại bằng loạt sản phẩm định hình thị trường và gần đây bứt phá ở mảng thiết bị đeo.",
    analysis: ["Từ năm 1997, công ty cắt giảm danh mục dàn trải để dồn sức cho vài thiết kế chủ lực: iMac, iPod, iPhone, iPad.", "Trọng tâm là thẩm mỹ, tính trực quan và trải nghiệm người dùng, không chạy theo công nghệ thuần túy.", "Rủi ro phía trước: văn hóa khép kín, thuê ngoài có thể biến đối tác thành đối thủ, và áp lực phải có sản phẩm đột phá kế tiếp."],
    lesson: "Đổi mới là thương mại hóa thành công, không nhất thiết phải là người phát minh đầu tiên." },
  { ch: 2, name: "Israel và công nghệ nước", img: "case-israel.jpg", tag: "Thành công", ok: true, title: "Khủng hoảng tạo ra hệ sinh thái đổi mới",
    context: "Đối mặt hạn hán nghiêm trọng, Israel triển khai đồng thời tiết kiệm, tái chế nước thải và khử muối nước biển.",
    analysis: ["Nhà nước đầu tư các nhà máy khử muối quy mô lớn và hỗ trợ đổi mới qua các cơ quan chuyên trách.", "Khoảng 86% nước thải được tái chế cho nông nghiệp; công nghệ thẩm thấu ngược làm chi phí khử muối giảm mạnh.", "Từ thiếu nước, Israel trở thành nước xuất khẩu công nghệ và dùng nước làm công cụ ngoại giao."],
    lesson: "Hệ thống đổi mới quốc gia hoạt động tốt khi nhà nước, viện trường và doanh nghiệp cùng hướng vào một bài toán lớn." },
  { ch: 3, name: "Parkrun", img: "case-parkrun.jpg", tag: "Thành công", ok: true, title: "Đổi mới xã hội do người dân khởi xướng",
    context: "Bắt đầu từ một buổi chạy 5 km miễn phí tại công viên Bushy, London năm 2004, Parkrun lan rộng nhờ tình nguyện viên và công nghệ đơn giản.",
    analysis: ["Mô hình giống nhượng quyền phi lợi nhuận: trụ sở cung cấp thiết bị và hệ thống; cộng đồng địa phương tự vận hành.", "Tài trợ đến từ các đối tác quan tâm tới sức khỏe cộng đồng.", "Khó khăn: mở rộng sang nước khác gặp rào cản, và ảnh hưởng tới doanh thu của các giải chạy thu phí."],
    lesson: "Đổi mới tạo giá trị công không nhất thiết đến từ nhà nước hay doanh nghiệp." },
  { ch: 4, name: "W.L. Gore & Associates", img: "case-gore.jpg", tag: "Thành công", ok: true, title: "Tổ chức không có sếp",
    context: "Nhà sản xuất vải Gore-Tex vận hành theo cấu trúc mạng lưới phẳng, không có sơ đồ tổ chức hình tháp hay chức danh quản lý cứng.",
    analysis: ["Bốn nguyên tắc: tự do, công bằng, cam kết và tham vấn trước các quyết định có rủi ro lớn.", "Giới hạn quy mô mỗi đơn vị khoảng 200 người; nhân viên mới có người bảo trợ thay cho sếp trực tiếp.", "Nhân viên sở hữu cổ phần nên gắn lợi ích với đổi mới dài hạn."],
    lesson: "Cấu trúc hữu cơ giúp ý tưởng lưu thông, nhưng đòi hỏi văn hóa và kỷ luật tự giác rất cao." },
  { ch: 5, name: "Chester Packaging", tag: "Thách thức", ok: false, title: "Đổi mới trên dây chuyền sản xuất",
    context: "Một nhà sản xuất bao bì thử ứng dụng loại bìa cứng có thể định hình để làm bao bì mới.",
    analysis: ["Vật liệu mới có nhiều ứng dụng tiềm năng nhưng chi phí cao gấp đôi.", "Khách hàng chỉ đặt hàng khi có sản lượng lớn, còn sản lượng lớn chỉ có khi có khách hàng.", "Quá trình phát triển gặp trục trặc kỹ thuật ngay trên dây chuyền."],
    lesson: "Đổi mới quy trình cần tìm được khách hàng tiên phong sẵn sàng trả giá cho lợi ích mới." },
  { ch: 7, name: "Ngành nút bần rượu vang", img: "case-cork.jpg", tag: "Thách thức", ok: false, title: "Khi lợi thế truyền thống không còn đủ",
    context: "Nút bần tự nhiên giữ vị trí chủ đạo suốt khoảng 400 năm, cho đến khi nút nhựa tổng hợp và nắp vặn xuất hiện từ thập niên 1990.",
    analysis: ["Hiện tượng rượu nhiễm mùi do hợp chất TCA khiến nhà sản xuất rượu tìm vật liệu thay thế.", "Các hãng rượu mới và chuỗi siêu thị lớn đòi hỏi chất lượng đồng nhất, nguồn cung ổn định và giá cạnh tranh.", "Ngành nút bần đáp lại bằng R&D về TCA, tích hợp chuỗi cung ứng và truyền thông về truyền thống, môi trường, nhưng chưa giải quyết triệt để."],
    lesson: "Không thể chỉ dựa vào lợi thế truyền thống: năng lực công nghệ phải được làm mới theo nhu cầu khách hàng." },
  { ch: 8, name: "Giao pizza bằng drone", img: "case-dominos.webp", tag: "Thách thức", ok: false, title: "Công nghệ mới gặp quy định",
    context: "Mùa hè 2013, một cửa hàng nhượng quyền Domino's tại Anh đăng video máy bay không người lái giao pizza: thử nghiệm thật hay chiêu quảng bá?",
    analysis: ["Lợi ích của drone dễ thấy, nhưng quy định hàng không ở nhiều nước hạn chế việc dùng cho mục đích thương mại.", "Mỗi phương tiện bay thêm vào làm tăng lo ngại về an toàn và quyền riêng tư.", "Chi phí để bay an toàn, như tránh va chạm và xử lý khi mất kết nối, làm giảm sức hấp dẫn của công nghệ."],
    lesson: "Đổi mới không diễn ra biệt lập: quy định và các bên liên quan quyết định tốc độ ứng dụng." },
  { ch: 9, name: "Pfizer Viagra", img: "case-pfizer.webp", tag: "Thành công", ok: true, title: "Hành trình 13 năm của một dự án R&D",
    context: "Hợp chất được nghiên cứu để trị đau thắt ngực. Thử nghiệm lâm sàng năm 1991 không đạt kỳ vọng, nhưng tình nguyện viên báo cáo một tác dụng phụ đáng chú ý.",
    analysis: ["Nền tảng là nghiên cứu khoa học có hệ thống về cơ chế giãn mạch, không chỉ là phát hiện tình cờ.", "Nhóm R&D thuyết phục ban quản lý cấp thêm hai năm kinh phí dù thị trường khi đó có vẻ rất nhỏ.", "Marketing góp phần hình thành thị trường, đồng thời làm dấy lên tranh luận đạo đức về việc mở rộng nhận thức bệnh."],
    lesson: "Không đánh giá dự án chỉ bằng kết quả ban đầu; R&D phải đi cùng đánh giá thị trường." },
  { ch: 10, name: "Dấu vân tay DNA", img: "case-dna.jpg", images: [{ src: "case-dna.jpg", alt: "Dấu vân tay DNA" }, { src: "case-alec.jpg", alt: "Alec Jeffreys và dấu vân tay DNA" }], tag: "Thành công", ok: true, title: "Từ tò mò khoa học đến ứng dụng pháp y",
    context: "Alec Jeffreys phát hiện kỹ thuật nhận dạng DNA khi nghiên cứu di truyền học. Công nghệ được cấp bằng sáng chế và chuyển giao cho doanh nghiệp để thương mại hóa.",
    analysis: ["Nghiên cứu cơ bản không nhắm tới nhu cầu thương mại nào.", "Chuyển giao từ đại học sang doanh nghiệp tạo ra dịch vụ xét nghiệm huyết thống và pháp y.", "Phim truyền hình khiến công chúng kỳ vọng quá mức vào bằng chứng DNA."],
    lesson: "Chuyển giao công nghệ biến tri thức khoa học thành giá trị, và cần đi kèm hiểu biết đúng của người dùng." },
  { ch: 14, name: "Dyson", img: "case-dyson.jpg", tag: "Thành công", ok: true, title: "Bị cả ngành từ chối",
    context: "James Dyson làm hơn 1.000 nguyên mẫu máy hút bụi không túi, nhưng các nhà sản xuất lớn đều từ chối mua giấy phép.",
    analysis: ["Các hãng đang có lãi từ việc bán túi bụi nên không muốn thay đổi.", "Sau hơn mười năm, Dyson tự lập nhà máy; nhà bán lẻ lúc đầu cũng từ chối vì giá cao gấp đôi sản phẩm dẫn đầu.", "Bảo hộ sáng chế và mức đầu tư R&D khoảng 17% doanh thu giúp giữ lợi thế."],
    lesson: "Với sản phẩm gián đoạn, phản hồi tiêu cực ban đầu của thị trường không phải là phán quyết cuối cùng." },
  { ch: 15, name: "3M", img: "case-3m.jpg", tag: "Thành công", ok: true, title: "Công ty đổi mới",
    context: "3M yêu cầu 30% doanh số phải đến từ sản phẩm ra đời chưa quá bốn năm.",
    analysis: ["Nhà khoa học được dành đến 15% thời gian làm việc cho dự án mình quan tâm.", "Chấp nhận thất bại và cho phép lập các nhóm khởi nghiệp nội bộ nhỏ, tự chủ.", "Khi áp dụng Six Sigma vào R&D, hiệu quả vận hành tăng nhưng tỷ lệ doanh số từ sản phẩm mới giảm."],
    lesson: "Kỷ luật vận hành và tự do sáng tạo cần những cách quản lý khác nhau." }
];

/* Lộ trình 15 tuần, mỗi tuần một chương, ba chặng trùng với ba phần của giáo trình.
   Sửa số tuần (w) tại đây nếu lịch học khác. */
window.ROADMAP = [
  { part: 1, phase: "Khởi động", outcome: "Giải thích được đổi mới là gì, ai tham gia, và vì sao tổ chức phải cân bằng giữa hiệu quả và sáng tạo.", weeks: [
    { w: 1, ch: 1, know: "Khái niệm, loại hình và mô hình đổi mới", skill: "Phân biệt phát minh với đổi mới; phân loại một đổi mới cụ thể" },
    { w: 2, ch: 2, know: "Hệ thống đổi mới quốc gia, khởi nghiệp", skill: "Phân tích vai trò nhà nước và thể chế trong một ngành" },
    { w: 3, ch: 3, know: "Đổi mới khu vực công, giá trị công", skill: "So sánh đổi mới công và tư; áp dụng tam giác Moore" },
    { w: 4, ch: 4, know: "Thế lưỡng nan, bản đồ bất định, cấu trúc tổ chức", skill: "Chẩn đoán năng lực đổi mới bằng kiểm toán đổi mới" },
    { w: 5, ch: 5, know: "Đổi mới quy trình, chất lượng, tinh gọn", skill: "Dùng phân tích khoảng cách và QFD cho một dịch vụ" }
  ]},
  { part: 2, phase: "Tăng tốc", outcome: "Đánh giá được một công nghệ dưới góc độ tài sản trí tuệ, năng lực, đối tác, R&D và mô hình kinh doanh.", weeks: [
    { w: 6, ch: 6, know: "Bằng sáng chế, nhãn hiệu, bản quyền", skill: "Chọn công cụ bảo hộ phù hợp cho một ý tưởng" },
    { w: 7, ch: 7, know: "Năng lực cốt lõi, tri thức tổ chức", skill: "Xác định năng lực cốt lõi và chiến lược đổi mới" },
    { w: 8, ch: 8, know: "Liên minh chiến lược, niềm tin", skill: "Đánh giá đối tác và rủi ro liên minh" },
    { w: 9, ch: 9, know: "Phân loại, ngân sách, đánh giá R&D", skill: "Lập tiêu chí chọn dự án R&D" },
    { w: 10, ch: 10, know: "Đổi mới mở, năng lực hấp thụ", skill: "Thiết kế phương án tiếp nhận công nghệ bên ngoài" },
    { w: 11, ch: 11, know: "Bốn bộ phận của mô hình kinh doanh", skill: "Phác thảo mô hình kinh doanh cho một công nghệ" }
  ]},
  { part: 3, phase: "Hoàn thiện", outcome: "Lập được kế hoạch phát triển sản phẩm mới từ ý tưởng đến ra mắt, có tính đến phản ứng của thị trường.", weeks: [
    { w: 12, ch: 12, know: "Khuếch tán, người dùng dẫn đầu, mô hình Bass", skill: "Dự báo nhịp chấp nhận của sản phẩm mới" },
    { w: 13, ch: 13, know: "Chiến lược và các mô hình NPD", skill: "Chọn mô hình NPD theo mức bất định" },
    { w: 14, ch: 14, know: "Nghiên cứu thị trường và giới hạn của nó", skill: "Chọn kỹ thuật kiểm tra sản phẩm phù hợp" },
    { w: 15, ch: 15, know: "Quản lý dự án NPD, đội liên chức năng", skill: "Lập kế hoạch NPD từ ý tưởng đến ra mắt" }
  ]}
];
