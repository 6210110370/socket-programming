# Socket Programming ( Movie Ticket ) 240-311
เป็นโปรแกรมที่ client จะทำการส่ง request ไปยัง server ว่าต้องการที่จะจองหลังเรื่องอะไรและที่นั่งไหนโดยที่เมื่อมีการจองที่นั่งนั้นๆไปแล้วก็จะไม่สามารถจองซ้ำได้อีก และมีการ log in ในตอนเริ่มต้นเพื่อที่จะเข้าไปจองทที่นั่ง
## สมาชิก
* นาย สิทธิศักดิ์     บ้านนบ      6210110370
* นาย สิทธิศักดิ์     ภู่เกียรติกุลศิริ  6210110371
* นางสาว อมรรัตน์   แซ่ตั้ง       6210110407
* นาย ชวลชัย      อภิชาตฐิติวรณ์ 6210110646
## State Diagram
![image](https://user-images.githubusercontent.com/78994035/150670793-4328bf80-8e17-4a03-a0d1-665db4d471f0.png)
> ได้ทำการตัดการทำงานบางส่วนออกไปเนื่องจากเวลาที่จำกัด<br/>
> username และ password มีแค่ (admin,admin) และ (test,test)
> หนังจะมี 3 เรื่องคือ m1, m2 และ m3<br/>
> ที่นั่งจะมี a - c โดยแต่ล่ะตัวอักษรจะมั 0 - 9
## การทำงานของ code
**client**<br/><br/>
ในฝั่งของ clientจะทำการส่ง request ไปยัง server โดยการรับค่าจาก command line ด้วยคำสั่งดังนี้
```js
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
     client.write(""+line)
});
```
ซึ่งเป็นการรับค่าจากแล้วส่งไปยัง server ผ่านคำสั่ง **client.write** และจะมีการเปลี่ยน **state** หรือ การแสดงผลไปยัง command line ตาม response ที่ได้มาจาก server โดยในแต่ล่ะ state ของ client ก็จะมีการรับค่าที่ต่างกัน และเป็นไปในทางเดียวกับ server<br/><br/>
**server**<br/><br/>
เมื่อได้รับ request จาก client ก็จะทำการประมวลผลและส่ง response กลับไปยัง client ตาม state ที่กำลังทำงานและค่าที่ได้รับผ่านคำสั่ง
```js
socket.write()
```
## แต่ล่ะ state การทำในของ code
### เมื่อ server เริ่มทำงาน
จะทำงานรอการเชื่อมต่อเข้ามาของ client<br/><br/>
![image](https://user-images.githubusercontent.com/78994035/150930568-f751d161-d79c-4872-bbe5-e40a7af4c076.png)
### มี client เข้ามาเชื่อมต่อ
ในส่วนของ server ก็จะบอกว่ามีการเชื่อมต่อเข้ามาของ client โดยที่สามารถเชื่อมต่อได้ครั้งล่ะหลาย client มากสุด 5 client<br/><br/>
![image](https://user-images.githubusercontent.com/78994035/150930810-2788f296-258b-41d7-af05-812680b3f7d3.png)<br/><br/>
โดยทำการสร้าง class member ขึ้นมาเพื่อแยกการทำงานในแต่ล่ะ client ที่เข้ามา
```js
class member{
  constructor(memPort){
    this.memPort = memPort
    this.state = 0;
    this.user = ""
    this.pass = ""
    this.movN = ""
  }

  changeState(state){
    this.state = state
  }

  get getMemState(){
    return this.state
  }

  get getMemPort(){
    return this.memPort
  }

}
```
### การ login
ในส่วนของการ login ก็จะตรวจสอบว่ารหัสผ่านถูกต้องไหมแล้วจึงใส่ password แล้วตรวจสอบว่าการ login ถูกต้องหรือไม่ตามการทำงานดังนี้<br/><br/>
* ใส่ username<br/><br/>
![image](https://user-images.githubusercontent.com/78994035/150931968-2845bcb4-9823-46a3-ac4b-e7806e6e5f4c.png)<br/><br/>
จะเห็ยได้ว่าใน client ตอนแรกใส่ username ผิดทำให้ต้องใส่อีกครั้งจึงจะใส่ password ได้<br/>
* ใส่ password<br/><br/>
![image](https://user-images.githubusercontent.com/78994035/150932271-9b0e1707-3ae1-4351-adc1-cbe1728f21c2.png)<br/><br/>
ในส่วนก็ password ก็เช่นกันจะทำการตรวจสอบว่าถูกต้องหรือไม่ (client ตัวที่ 2 ใส่ผิดในตอนแรก) และจึงสามารถเลือกหนังได้<br/>
### การเลือกที่นั่ง
หนังแต่ล่ะเรื่องจะจัดการผ่าน
```js
let tagMov = ["m1","m2","m3"]
let movName = ['spider man','super man','iron man']
let movies = new Object()
for(let i=0;i<3 ;i++){
  movies[tagMov[i]] = new movie(movName[i]);
}
```
โดยใน class movie นั้นๆก็จะมี class seat เพื่อจัดการที่นั่งในแต่ล่ะเรื่อง
* กรณีที่ใส่ชื่อหนังผืดก็จะไม่มีที่นั่งเลย
![image](https://user-images.githubusercontent.com/78994035/150932704-89cad366-6855-4911-a14d-0a3b938ac0c4.png)
* ตัวอย่างการจองที่นั่งต่าง
![image](https://user-images.githubusercontent.com/78994035/150933123-d73522dc-fa15-468f-b2ff-92d8872fd19e.png)<br/><br/>
จะเห็นได้ว่าเมื่อ client 1 จองหนัง m1 ที่นั่ง b2 จะไม่สามารถจองได้เนื่องจาก client 2 จองไปแล้วแต่ถ้าใส่ที่นั่งที่ว่างก็จะจองได้ปกติ





