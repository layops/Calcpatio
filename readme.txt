db için mongodb atlastan free cluster oluşturulur. ve verilen db oraya import edilir.
server kısmı herokuya yüklenmeli ve env tanımlamaları yapılmalı.

ATLAS_URI=mongodb atlas erişim uri
JWT_TOKEN=256 bit bir şifre tanımlanır
MESSAGE_404="404 Not found!" olarak tanımlanır
SECRET_PASSWORD=bir sifre tanımlanır bu user olusturulurken kullanılan guvenlik icin.

client kısmı netlify e yüklenecek yüklemeden önce index.js içerisindeki base url yi kendi herokunuzun url yi olarak güzenleyin.
örn:
axios.defaults.baseURL = 'https://calcpatio-server.herokuapp.com/api';
