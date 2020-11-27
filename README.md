### SERVER demo nhập môn đảm bảo an ninh thông tin

##### Repositories Server : https://github.com/HrqstnElq/DemoIE105-server

##### Truy cập vào link :  http://demo-antt-nhom1.herokuapp.com/ và chờ server chạy 
##### Sau đó truy cập website : http://demo-ie105.surge.sh hoặc https://focused-khorana-dac803.netlify.app/ nên sử dụng link http để có thể không sử dụng giao thức mã hóa TLS/SSL của websever

> username : tri, trung, duy; password : 1

#### 1.	Các loại mã hóa sử dụng

- RSA  : dùng để client gửi thông tin đăng nhập về cho server ở chế độ **safe mode**
- AES : dùng để client giao tiếp với server và ngược lại sau khi đăng nhập
- SHA256 : dùng để băm mật khẩu
- HMAC-SHA256 (HS256) để tính toán VERIFY SIGNATURE của token đăng nhập.
- Diffie-Hellman : thuật toán dùng để trao đổi khóa. Khóa được trao đổi ở đây là khóa của hệ mã hóa AES. Ở đây sử dụng **Diffie-Hellman Groups 1**   :  https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk27054

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

   - Server sẽ gửi **public key rsa** và server **public key Diffie-Hellman** về cho client 

   - user nhập : username + mật khẩu. (1)

   - Client sẽ tạo ra một **public key Diffie-Hellman**  (2) 

   - Client sẽ dùng khóa RSA gửi 1 + 2 về cho server .

   -  Cùng lúc đó Client sẽ gửi những thông tin sau lên server : **Username + password + Client public key Diffie-Hellman ** và được giải mã bằng khóa private rsa của server 

   -  Server khi nhận được sẽ dùng khóa private rsa để giải mã và lấy thông tin đăng nhập so khớp mật khẩu như chế độ **Unsafe mode**  nếu đúng thì sẽ sinh khóa AES 

   -  Bằng việc sử dụng **Diffie-Hellman** có số nguyên tố và căn nguyên thuộc **modp1**. Từ server và client có thể kết hợp thêm public key của nhau để sinh ra cùng một khóa. Khóa này sẽ được sử dụng là khóa mã hóa **AES**

     ```js
     	generateSecretKey(serverPublicKey) {
     		//chuyển base thành buffer
     		const serverKey=Buffer.from(serverPublicKey, "base64");
     		const secretKey=this.client/server.computeSecret(serverKeyServer/Client).toString("base64");
     		return secretKey;
     	}
     ```
     
   - Quá trình trao đổi tin nhắn sau này sẽ dùng khóa AES này

3. **Cài đặt và khởi chạy** 

   - Yêu cầu máy tính :

     - HDH : Windows, Linux, MacOS 
     - Cài đặt môi trường nodejs
     
- Cài dặt và khởi chạy 
   
  - Clone https://github.com/HrqstnElq/DemoIE105-server
   
  - mở terminal tại thư mục cùng cấp với file pakage.json. Chạy cái lệnh sau 
   
    ```powershell
       npm install 
       npm start 
       ```
   
    
