/* ====== FILE CẤU HÌNH — CHỈNH SỬA Ở ĐÂY ======
   Nội dung trang chủ, giảng viên, review, nhóm thực hiện và kho tài liệu. */
window.SITE = {
  courseName: "Quản trị sáng tạo và đổi mới",
  courseNameEn: "Innovation Management and New Product Development",
  notice: "Website được xây dựng phục vụ mục đích học tập môn Quản trị sáng tạo và đổi mới.",
  /* Link Google Docs chứa bản dịch và ghi chú đầy đủ của nhóm ("" nếu không muốn hiện) */
  sourceDoc: "https://docs.google.com/document/d/1yNWbke2rieG10Xz2uG6HnngFJ9MNfyKFyIu-i8xB7EM/edit",

  /* ---------- GIỌNG ĐỌC BÀI GIẢNG (Google Gemini TTS) ----------
     Khóa API đặt ở tts-key.js hoặc nhập trên trang (nút "Khóa API"). Có thể đổi tên giọng tại đây. */
  tts: { model: "gemini-3.8-flash-tts", female: "Sulafat", male: "Charon" },

  /* ---------- 1. TRANG CHỦ ---------- */
  home: {
    overview: "Quản trị Sáng tạo và Đổi mới (Innovation Management and New Product Development) là học phần cốt lõi trang bị tư duy và công cụ giúp doanh nghiệp biến những ý tưởng đột phá hoặc phát minh khoa học thành các sản phẩm, dịch vụ thương mại có giá trị trên thị trường. Khác với quan niệm cho rằng sáng tạo chỉ là sự ngẫu hứng của những cá nhân đơn độc, môn học tiếp cận đổi mới như một quy trình quản trị có hệ thống - nơi kết nối chặt chẽ giữa năng lực công nghệ (R&D), nguồn lực nội bộ tổ chức và tín hiệu nhu cầu thị trường.",
    why: [
      { title: "Sống còn trong kỷ nguyên biến động", text: "Trong một thế giới công nghệ thay đổi chóng mặt, các doanh nghiệp dẫn đầu hoàn toàn có thể bị đánh bật nếu đối thủ thay đổi quy luật cạnh tranh bằng những đổi mới gián đoạn (Disruptive Innovation). Môn học giúp giải mã cách thức doanh nghiệp vừa duy trì hiệu quả hiện tại, vừa linh hoạt thích ứng để không bị tụt hậu." },
      { title: "Thu hẹp khoảng cách từ \"Ý tưởng\" đến \"Thương mại hóa\"", text: "Một phát minh vĩ đại sẽ mãi nằm trên giấy nếu thiếu chiến lược đưa ra thị trường. Học phần cung cấp lộ trình bài bản từ việc quản trị hoạt động R&D, bảo hộ tài sản trí tuệ, quản lý danh mục sản phẩm mới (NPD) cho đến việc thiết kế mô hình kinh doanh khả thi." },
      { title: "Năng lực cốt lõi của nhà quản trị tương lai", text: "Mọi tổ chức hiện đại đều khao khát những nhân sự có khả năng giải quyết vấn đề sáng tạo và tư duy đổi mới. Kiến thức từ môn học là bệ phóng vững chắc giúp sinh viên kinh tế – quản trị tự tin tham gia vào các dự án khởi nghiệp, phát triển sản phẩm hoặc hoạch định chiến lược doanh nghiệp." }
    ],
    objectivesIntro: "Sau khi hoàn thành hành trình khám phá học phần Quản trị Sáng tạo và Đổi mới, sinh viên sẽ có khả năng:",
    /* icon: số chương có hình minh họa dùng làm biểu tượng (1–15) */
    objectives: [
      { icon: 1, title: "Nắm vững nền tảng lý thuyết đổi mới", text: "Phân biệt rõ ràng giữa phát minh (invention) và đổi mới sáng tạo (innovation); nhận diện được các loại hình đổi mới (sản phẩm, quy trình, mô-đun, kiến trúc, tiệm tiến và triệt để) trong từng bối cảnh ngành." },
      { icon: 10, title: "Vận dụng các mô hình quản trị hiện đại", text: "Hiểu và áp dụng được các khung lý thuyết kinh điển như Mô hình đổi mới tương tác (Interactive Model), Mô hình đổi mới tuần hoàn (CIM), Đổi mới mở (Open Innovation) và Tổ chức thuận hai tay (Ambidextrous Organisation)." },
      { icon: 13, title: "Quản trị hiệu quả quy trình phát triển sản phẩm mới (NPD)", text: "Phân tích được vai trò của nghiên cứu thị trường, quản trị rủi ro/bất định (Bản đồ bất định Pearson), hiệu ứng tập người dùng sẵn có (installed base) và chi phí chuyển đổi (switching costs) khi tung sản phẩm ra thị trường." },
      { icon: 8, title: "Hoạch định chiến lược R&D và Liên minh công nghệ", text: "Đánh giá được cách thức phân bổ nguồn lực cho Nghiên cứu & Phát triển, quản trị tài sản trí tuệ và xây dựng mạng lưới hợp tác giữa doanh nghiệp – viện nghiên cứu – chính phủ (Mô hình Triple Helix)." },
      { icon: 14, title: "Phát triển tư duy phản biện thông qua thực tiễn", text: "Biết cách mổ xẻ nguyên nhân thành công hay thất bại của các doanh nghiệp và startup thực tế, từ đó đề xuất giải pháp đổi mới sáng tạo khả thi cho các bài toán kinh doanh cụ thể." }
    ]
  },

  /* ---------- 2. GIẢNG VIÊN ---------- */
  instructorPage: {
    title: "Người dẫn đường hành trình đổi mới",
    lead: "Được truyền cảm hứng từ những bài giảng tâm huyết của thầy trên lớp, nhóm đã xây dựng website này như một món quà tri ân và là không gian tổng hợp tri thức phục vụ môn Quản trị Sáng tạo và Đổi mới. Mời bạn cùng kết nối với giảng viên hướng dẫn của chúng mình và lắng nghe những chia sẻ từ các thành viên trong nhóm."
  },
  instructor: {
    photo: "giang-vien.jpg",
    name: "ThS. Nguyễn Phương Nam",
    title: "Khoa Quản trị / Trường Kinh doanh UEH – Đại học Kinh tế TP. Hồ Chí Minh",
    email: "namnp@ueh.edu.vn",
    website: "https://thaynam.top/",
    bio: "Giảng viên phụ trách học phần Quản trị Sáng tạo và Đổi mới (Innovation Management and New Product Development). Với phong cách giảng dạy kết hợp chặt chẽ giữa nền tảng lý thuyết chuẩn quốc tế và tư duy phản biện thực tiễn, thầy không chỉ truyền đạt kiến thức mà còn khơi gợi tinh thần dám thử nghiệm và đổi mới ở sinh viên."
  },
  /* Review của 7 thành viên nhóm */
  reviews: [
    { name: "Đinh Quốc Anh", text: "Mình rất thích cách thầy dẫn dắt bài giảng vì mọi thứ được sắp xếp rất logic và dễ theo dõi. Thay vì bắt tụi mình học thuộc lòng từng định nghĩa trong giáo trình, thầy luôn gợi mở để cả lớp tự suy nghĩ và liên hệ với những sản phẩm, dịch vụ xung quanh. Sau mỗi buổi học của thầy, mình cảm thấy đầu óc mở mang hơn và biết cách nhìn nhận vấn đề mới mẻ hơn trước." },
    { name: "Trương Tấn Dũng", text: "Thầy luôn khuyến khích tụi mình không chỉ học thuộc định nghĩa mà phải biết đặt câu hỏi qua từng case study thực tế. Nhờ thầy, mình hiểu rằng sáng tạo trong kinh doanh không phải là sự ngẫu hứng, mà là cả một quá trình quản trị bài bản." },
    { name: "Hồ Thế Huy", text: "Không khí lớp học của thầy rất cởi mở và tôn trọng sự khác biệt. Mọi ý tưởng dù 'điên rồ' đến đâu khi đưa ra thảo luận đều được thầy lắng nghe, phản biện sắc bén nhưng vẫn cực kỳ tâm lý để tụi mình tự hoàn thiện." },
    { name: "Nguyễn Tùng Lâm", text: "Trong suốt quá trình nhóm thực hiện dự án xây dựng website môn học, những định hướng của thầy đã giúp tụi mình biết cách chắt lọc kiến thức trọng tâm và tổ chức thông tin khoa học hơn rất nhiều." },
    { name: "Lê Nguyễn Thùy Linh", text: "Học thầy giúp mình rèn được tư duy nhìn nhận vấn đề đa chiều. Thầy thường đặt ra những tình huống ngược dòng để sinh viên tự thoát khỏi lối mòn suy nghĩ cũ – đúng với tinh thần của môn Quản trị sáng tạo và đổi mới." },
    { name: "Lại Huỳnh Thanh Trúc", text: "Những chia sẻ ngoài lề của thầy về xu hướng thị trường và kinh nghiệm thực chiến là điểm sáng lớn nhất đối với mình. Môn học này thực sự đã thay đổi cách mình nhìn nhận về giá trị của một sản phẩm mới." },
    { name: "Trần Thiên Trường", text: "Thầy rất nhiệt tình giải đáp thắc mắc của sinh viên. Sự chỉn chu và tâm huyết của thầy chính là động lực lớn nhất để nhóm mình dồn toàn lực hoàn thành dự án này một cách tốt nhất." }
  ],

  /* ---------- NHÓM THỰC HIỆN (hiện ở chân trang) ---------- */
  team: {
    members: ["Đinh Quốc Anh", "Trương Tấn Dũng", "Hồ Thế Huy", "Nguyễn Tùng Lâm", "Lê Nguyễn Thùy Linh", "Lại Huỳnh Thanh Trúc", "Trần Thiên Trường"],
    classCode: "",   // Mã lớp học phần — chưa có trong file phác thảo
    faculty: "Đại học Kinh tế TP. Hồ Chí Minh (UEH)"
  },

  /* ---------- 4. KHO TÀI LIỆU ----------
     type: "slide" | "giao-trinh" | "khac"; chapter: số chương (hoặc 0 nếu dùng chung)
     Ví dụ: { title: "Slide chương 1", type: "slide", chapter: 1, url: "https://..." } */
  materials: [
    {"title": "Tài liệu", "type": "khac", "chapter": 0, "url": "tai-lieu.pdf"},
    {"title": "Tài liệu tự học AI", "type": "khac", "chapter": 0, "url": "tai-lieu-tu-hoc-ai.pdf"},
    {"title": "Innovation Potential Diagnostic", "type": "khac", "chapter": 0, "url": "Innovation_Potential_Diagnostic.pdf"},
    {"title": "Startup Innovation Blueprint", "type": "khac", "chapter": 0, "url": "Startup_Innovation_Blueprint.pdf"},
    {"title": "Phần I - Các mô hình đổi mới", "type": "khac", "chapter": 0, "url": "phan-i-cac-mo-hinh-doi-moi.pdf"},

    { title: "Bản dịch và ghi chú đầy đủ 15 chương (Google Docs của nhóm)", type: "giao-trinh", chapter: 0, url: "https://docs.google.com/document/d/1yNWbke2rieG10Xz2uG6HnngFJ9MNfyKFyIu-i8xB7EM/edit" }
  ]
};
