# Hướng dẫn quản trị — Lisa Beauty (bản chia từng phần)

Bản này được tách từ file `index.html` một file duy nhất anh gửi (bản HTTrack
của lisabeautynails.net), giữ nguyên giao diện: cùng HTML, class, CSS, nội
dung, link và ảnh. Chỉ thay đổi cách tổ chức file để dễ sửa từng phần.

## Cấu trúc

| File | Sửa cái gì |
|---|---|
| `index.html` | Khung trang: thẻ `<head>` (title, meta, gtag, JSON-LD, Facebook Pixel) + 9 ô nạp partial. Không sửa nội dung ở đây trừ khi đổi title/meta. |
| `partials/header.html` | Thanh chuyển ngôn ngữ PT/EN + menu điều hướng. |
| `partials/hero.html` | Phần mở đầu (hero). |
| `partials/about.html` | Giới thiệu salon + 4 điểm nổi bật. |
| `partials/services.html` | Bảng giá 4 tab: nails, pedicure, addons, lashes. |
| `partials/gallery.html` | Lưới ảnh gallery. |
| `partials/feedback.html` | Phần feedback (ảnh khách). |
| `partials/reviews.html` | Đánh giá Google. |
| `partials/booking.html` | Form đặt lịch qua WhatsApp. |
| `partials/footer.html` | Chân trang + nút WhatsApp nổi + thanh "Book Now" mobile + lightbox và 2 modal (chọn địa điểm, chính sách). |
| `css/style.css` | Toàn bộ CSS của trang (nguyên văn khối `<style>` trong file gốc). |
| `js/loader.js` | Nạp từng partial vào đúng vị trí rồi mới nạp `js/main.js`. |
| `js/main.js` | Toàn bộ script cuối trang gốc: chuyển ngôn ngữ, chuyển tab, hiệu ứng reveal, form WhatsApp, lightbox, modal. |
| `images/` | 86 ảnh JPG tách ra từ file gốc (xem dưới). |

## Sửa ảnh

Ảnh đặt tên theo phần chứa nó, theo thứ tự xuất hiện trong file gốc:

- `about-01.jpg` (1 ảnh), `services-01.jpg` → `services-03.jpg` (3 ảnh),
  `gallery-01.jpg` → `gallery-70.jpg` (70 ảnh),
  `feedback-01.jpg` → `feedback-10.jpg` (10 ảnh),
  `booking-01.jpg`, `booking-02.jpg` (2 ảnh).

Muốn thay ảnh nào thì ghi đè đúng tên file đó, giữ định dạng JPG. Đừng đổi
tên file nếu không sửa luôn `src` trong partial tương ứng.

## Xem thử và deploy

- **Không mở `index.html` bằng cách nhấp đúp (file://)** — trình duyệt sẽ
  chặn `fetch` nạp partial, trang sẽ trống. Xem thử bằng server cục bộ
  trong thư mục này, ví dụ: `python3 -m http.server 8000` rồi mở
  `http://localhost:8000/`.
- Khi deploy, upload **cả thư mục giữ nguyên cấu trúc** (index, partials,
  css, js, images). Thiếu thư mục `images/` là mất ảnh.
- Lưu ý: form đặt lịch sau khi gửi sẽ chuyển sang `obrigado.html` như code
  gốc. File đó **không có trong file anh gửi lần này** nên không nằm trong
  bộ này — khi deploy nhớ giữ/upload riêng file `obrigado.html` nếu đã có.

## Những điểm đã thay đổi so với file gốc (chỉ 4 điểm, đều vì lý do kỹ thuật)

1. **CSS:** khối `<style>` trong `<head>` chuyển nguyên văn sang
   `css/style.css`, `index.html` chỉ còn dòng `<link>` trỏ tới nó.
2. **Script cuối trang:** 3 script cuối body gom nguyên văn vào `js/main.js`
   (script trong partial nạp bằng fetch sẽ không tự chạy, nên phải nạp
   riêng sau khi đủ partial). Một chỗ duy nhất sửa logic cho khớp cách nạp
   mới: đoạn lightbox gốc dùng `DOMContentLoaded` — vì `main.js` nạp sau
   khi partial đã chèn xong nên đổi thành kiểm tra `document.readyState`
   (nếu trang chưa load xong thì chờ `DOMContentLoaded`, nếu rồi thì chạy
   ngay). Hành vi lightbox giữ nguyên.
3. **Ảnh:** 86 ảnh trong file gốc đều nhúng dạng base64 (tổng ~12MB, riêng
   phần gallery đã ~11MB một dòng). Nếu giữ nguyên, file partial vẫn nặng
   và không sửa được. Em đã giải mã đúng byte gốc thành 86 file JPG trong
   `images/` và đổi `src` thành đường dẫn tương đối — ảnh hiển thị y hệt,
   tổng bộ còn ~8,9MB. Favicon SVG trong `<head>` vẫn giữ nguyên dạng
   data URI như gốc.
4. **Dọn 2 dòng của HTTrack:** chú thích "Mirrored from..." và thẻ meta
   `content-type` thừa do HTTrack chèn ngoài `<head>` (trong `<head>` đã có
   `charset=UTF-8`).

Ngoài 4 điểm trên, loader thay thế ô `<div data-include>` bằng chính nội
dung partial nên DOM cuối cùng không có div bọc thừa, giống hệt cấu trúc
body của file gốc. Các script trong `<head>` (gtag, conversion, JSON-LD,
Facebook Pixel) giữ nguyên trong `index.html`.

## Đã kiểm tra

- Ghép 9 partial lại khớp **tuyệt đối** với body file gốc (sau khi trừ script
  đã chuyển sang `js/main.js` và đổi `src` ảnh theo mục 3).
- CSS trong `css/style.css` khớp tuyệt đối khối `<style>` gốc; `<head>` của
  `index.html` khớp tuyệt đối `<head>` gốc trừ việc `<style>` thành `<link>`.
- Số lượng giữ nguyên: 7 section, 87 thẻ `<img>` (gồm 1 ảnh lightbox
  `src="#"` như gốc), 37 link, 210 thuộc tính `data-pt`, 27 id, 406 class.
- `node --check` cho `js/main.js` và `js/loader.js` đều đạt.
- Chạy server cục bộ và kiểm tra cả 99 file (index, partials, css, js,
  86 ảnh) đều trả về 200.
