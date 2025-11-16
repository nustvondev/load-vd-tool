# Minimal Electron Video Player

Ứng dụng Electron đơn giản phát các tệp video cục bộ theo yêu cầu trong `buildapp.md`.

## Cách chạy

```bash
npm install
npm start
```

## Tính năng chính

- Cửa sổ nội dung sạch, nền đen, có thể thay đổi kích thước và hỗ trợ toàn màn hình.
- Tự động phát `default-video.mp4` (nếu đặt cùng thư mục ứng dụng).
- Phát vòng lặp vô hạn, hỗ trợ chọn tệp video bất kỳ.
- Phím tắt:
  - `O`: mở hộp thoại chọn video.
  - `F`: chuyển đổi toàn màn hình.
  - `Arrow Up` / `Arrow Down`: phóng to / thu nhỏ.
  - `H`: lật ngang.
  - `V`: lật dọc.
  - `R`: đặt lại mọi chuyển đổi.
- Các phép biến đổi được áp dụng ngay lập tức, đảm bảo video luôn lấp đầy cửa sổ và giữ tỷ lệ khung hình.

## Ghi chú

- Đặt tệp `default-video.mp4` tại thư mục gốc dự án để ứng dụng tự phát khi khởi động.
- Video luôn phát với chế độ loop để tạo trải nghiệm trình chiếu liên tục.

