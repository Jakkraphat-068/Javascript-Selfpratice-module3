// Synchronous (ทำตามลำดับ) 
console.log('1. ต้มน้ำ');
console.log('2. หั่นผัก'); 

//  Asynchronous (ใช้ setTimeout จำลองการรอ) 
console.log('1. เริ่มต้มน้ำ (Async)');


setTimeout(() => {
    console.log('3. น้ำเดือดแล้ว!'); 
}, 3000); 
console.log('2. หั่นผักรอเลย');


// Promise 
const checkMoney = new Promise((resolve, reject) => {
    const money = 100;
    if (money >= 100) {
        resolve("ซื้อของได้!"); 
    } else {
        reject("เงินไม่พอ");  
    }
});

checkMoney
    .then((result) => {
        console.log("Success:", result); 
    })
    .catch((error) => {
        console.error("Failed:", error);
    });

// Async / Await
function downloadFile() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("ไฟล์มาแล้ว"), 2000);
    });
}

async function main() {
    console.log("เริ่มดาวน์โหลด...");
    try {
        const file = await downloadFile(); 
        console.log("ได้รับ:", file);
    } catch (error) {
        console.error("ดาวน์โหลดล้มเหลว");
    }
    
    console.log("จบการทำงาน");
}

main();



