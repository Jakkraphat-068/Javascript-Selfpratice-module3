// เลือก element ต่างๆ จาก DOM
const title = document.getElementById("title"); // h1
const inputText = document.getElementById("inputText"); // ช่องพิมพ์
const showBtn = document.getElementById("showBtn"); // ปุ่มแสดงข้อความ
const display = document.getElementById("display"); // <p> แสดงผล
const colorBtn = document.getElementById("colorBtn"); // ปุ่มเปลี่ยนสีหัวข้อ


// Event 1: แสดงข้อความจาก input เมื่อกดปุ่ม "Show Text"
showBtn.addEventListener("click", function () {
  const text = inputText.value; // รับค่าที่ผู้ใช้พิมพ์

  if (text === "") {
    display.textContent = "กรุณากรอกข้อความก่อน";
    display.style.color = "red";
  } else {
    display.textContent = text; // แสดงข้อความที่พิมพ์
    display.style.color = "black";
  }
});


// Event 2: เปลี่ยนสี title แบบสุ่มเมื่อกดปุ่ม "Change Title Color"
colorBtn.addEventListener("click", function () {
// สุ่มค่าสีในรูปแบบ rgb
const r = Math.floor(Math.random() * 256);
const g = Math.floor(Math.random() * 256);
const b = Math.floor(Math.random() * 256);


title.style.color = `rgb(${r}, ${g}, ${b})`;
});