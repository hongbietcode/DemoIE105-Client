### SERVER demo nhập môn đảm bảo an ninh thông tin

##### Repositories Server : https://github.com/HrqstnElq/DemoIE105-server

#### 1.	Các loại mã hóa sử dụng

- RSA  : dùng để client gửi thông tin đăng nhập về cho server ở chế độ **safe mode**
- AES : dùng để client giao tiếp với server và ngược lại sau khi đăng nhập
- SHA256 : dùng để băm mật khẩu
- HMAC-SHA256 (HS256) để tính toán VERIFY SIGNATURE của token đăng nhập.
- PBKDF2 : dùng để tạo AES key và **Client key** (một chuổi random do client gửi lên server nhằm tránh trùng lặp khóa)

#### 2. Quá trình hoạt động 

1. **Unsafe mode :** 

   - username + mật khẩu  → gửi đến server → dùng SHA256 băm password  → đúng trả về token và thông tin, sai trả về 500 response 
   - Sau đó người dùng gửi tin nhắn qua lại. 

   > Cả quá trình này đều không mã hóa nên thông tin sẽ bị lộ 

   NOTE : Quá trình băm mật khẩu : 

   ```js
   const hashPassword = (password, salt) => {
   	var randomSalt;
       //nếu không truyền vào salt (tạo tài khoản). thì sẽ random chuỗi này
   	if (salt) randomSalt = salt;
   	else randomSalt = Base64.parse(Math.ceil(Math.random() * 10 ** 16).toString());
   	const hashPassword = Base64.stringify(sha256(password + randomSalt + process.env.PEPPER_KEY));
   
   	return {
   		salt: randomSalt,
   		passwordDigit: hashPassword,
   	};
   };
   ```

   Giải thích : 

   - Salt : một chuổi ngẩu nhiên được sinh ra nhằm ngăn chặn các password khác giống nhau sinh ra cùng một mã hash
   - PEPPER_KEY : chuỗi bí mật được lưu tách biệt với database nhằm mục đích nếu database bị tấn công thì sẽ không biết được chuổi này và làm quá trình tìm ngược mật khẩu trở nên khó khăn hơn.
   - sau khi hash passord, sẽ có dạng WordArray nên chuyển thành base64 để dễ lưu trữ hơn

2. **Safe mode** 

   - Server sẽ gửi **public key** rsa về cho client 

   - username + mật khẩu + **secret key** (khóa bí mật sẽ không được gửi đến server trong quá trình đăng nhập. khóa này sẽ được thương lượng trước với server và người dùng phải nhớ. Nhằm ngăn chặn tấn công kiểu **man-in-the-middle** )

   - Client sẽ tạo ra một chuổi random gọi là **client key** nhằm khi sinh khóa sẽ mang tính ngẫu nhiên 

   -  Client sẽ sinh khóa AES bằng thuật toán PBKDF2 (Khóa này sẽ không gửi lên server nhằm đảm bảo tính bảo mật)

     ```js
     export const AESGenerateSecretKey = (secretKey, clientKey) => {
     	const AESKey128Bits = CryptoJS.PBKDF2(secretKey, clientKey, {
     		keySize: 128 / 32,
     	}).toString();
     
     	window.localStorage.setItem("AESKey", AESKey128Bits);
     	return AESKey128Bits;
     };
     ```

   - Cùng lúc đó Client sẽ gửi những thông tin sau lên server : **Username + password + Client key**  và được mã hóa bằng khóa public rsa của server 

   - Server khi nhận được sẽ dùng khóa private rsa để giải mã và lấy thông tin đăng nhập so khớp mật khẩu như chế độ **Unsafe mode** và truy xuất database để lấy **secret key** + **client key**  và tạo ra AES key. Khóa này sẽ hoàn toàn dống với client.

   - Quá trình trao đổi tin nhắn sau này sẽ dùng khóa AES này

3. Cài đặt và khởi chạy 

   - Yêu cầu máy tính :

     - HDH : Windows, Linux, MacOS 
     - Cài đặt môi trường nodejs
     
- Cài dặt và khởi chạy 
   
  - Clone https://github.com/HrqstnElq/DemoIE105-Client
   
  - mở terminal tại thư mục cùng cấp với file pakage.json. Chạy cái lệnh sau 
   
    ```powershell
       npm install 
       npm start 
       ```
   
    