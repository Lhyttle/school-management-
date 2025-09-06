const data = {
  students: 250,
  teachers: 20,
  subjects: ["Math", "English", "Science", "ICT", "History"],
  feesPaid: 180,
  feesUnpaid: 70,
  totalAmountDue: "₵35,000"
};

document.getElementById("students").textContent += data.students;
document.getElementById("teachers").textContent += data.teachers;
document.getElementById("subjects").textContent += data.subjects.length;
document.getElementById("fees-paid").textContent += data.feesPaid;
document.getElementById("fees-unpaid").textContent += data.feesUnpaid;
document.getElementById("total-amount").textContent += data.totalAmountDue;