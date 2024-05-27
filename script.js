document.addEventListener("DOMContentLoaded", function() {
    const addSemesterButton = document.getElementById("addSemester");
    const removeSemesterButton = document.getElementById("removeSemester");
    const printPageButton = document.getElementById("printPage");
    const semesterBody = document.getElementById("semesterBody");
    const iraValue = document.getElementById("iraValue");
    const gpaValue = document.getElementById("gpaValue");
    const mediaValue = document.getElementById("mediaValue");
    const totalSs = document.getElementById("total-ss");
    const totalMs = document.getElementById("total-ms");
    const totalMm = document.getElementById("total-mm");
    const totalMi = document.getElementById("total-mi");
    const totalIi = document.getElementById("total-ii");
    const totalSr = document.getElementById("total-sr");
    const totalCredits = document.getElementById("total-credits");
    
    let semesterCount = 0;
    
    const gradeValues = {
        SS: 5,
        MS: 4,
        MM: 3,
        MI: 2,
        II: 1,
        SR: 0
    };

    // Initialize the table with 8 periods
    for (let i = 1; i <= 8; i++) {
        addSemester();
    }

    addSemesterButton.addEventListener("click", addSemester);
    removeSemesterButton.addEventListener("click", removeSemester);
    printPageButton.addEventListener("click", printPage);

    function addSemester() {
        semesterCount++;

        const row = document.createElement("tr");
        row.id = `semester-${semesterCount}`;
        
        const semesterCell = document.createElement("td");
        semesterCell.textContent = `${semesterCount}º`;
        row.appendChild(semesterCell);

        ['SS', 'MS', 'MM', 'MI', 'II', 'SR'].forEach(grade => {
            const gradeCell = document.createElement("td");
            const gradeInput = document.createElement("input");
            gradeInput.type = "number";
            gradeInput.min = 0;
            gradeInput.max = 10;
            gradeInput.placeholder = grade; // Set placeholder
            gradeInput.addEventListener("input", updateIRA);
            gradeCell.appendChild(gradeInput);
            row.appendChild(gradeCell);
        });

        const totalCreditsCell = document.createElement("td");
        totalCreditsCell.id = `total-credits-${semesterCount}`;
        totalCreditsCell.textContent = '0'; // Pre-fill with zero
        row.appendChild(totalCreditsCell);

        semesterBody.appendChild(row);
    }

    function removeSemester() {
        if (semesterCount > 0) {
            const row = document.getElementById(`semester-${semesterCount}`);
            semesterBody.removeChild(row);
            semesterCount--;
            updateIRA();  // Recalculate IRA after removing a period
        }
    }

    function updateIRA() {
        let totalWeightedCredits = 0;
        let totalWeight = 0;
        let totalCreditsGPA = 0;

        let sumSs = 0;
        let sumMs = 0;
        let sumMm = 0;
        let sumMi = 0;
        let sumIi = 0;
        let sumSr = 0;
        let sumTotalCredits = 0;

        for (let i = 1; i <= semesterCount; i++) {
            const row = document.getElementById(`semester-${i}`);
            const inputs = row.querySelectorAll("input");
            const weight = Math.min(i, 6);

            let semesterCredits = 0;
            
            inputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                const grade = input.placeholder;
                const gradeValue = gradeValues[grade] || 0;
                totalWeightedCredits += value * weight * gradeValue;
                totalWeight += value * weight;
                totalCreditsGPA += value * gradeValue;
                semesterCredits += value;

                // Summing up grades for total row
                switch (grade) {
                    case 'SS':
                        sumSs += value;
                        break;
                    case 'MS':
                        sumMs += value;
                        break;
                    case 'MM':
                        sumMm += value;
                        break;
                    case 'MI':
                        sumMi += value;
                        break;
                    case 'II':
                        sumIi += value;
                        break;
                    case 'SR':
                        sumSr += value;
                        break;
                }
            });

            sumTotalCredits += semesterCredits;
            document.getElementById(`total-credits-${i}`).textContent = semesterCredits;
        }

        totalSs.textContent = sumSs;
        totalMs.textContent = sumMs;
        totalMm.textContent = sumMm;
        totalMi.textContent = sumMi;
        totalIi.textContent = sumIi;
        totalSr.textContent = sumSr;
        totalCredits.textContent = sumTotalCredits;

        const ira = totalWeight ? (totalWeightedCredits / totalWeight).toFixed(2) : "0.00";
        iraValue.textContent = `${ira} / 5.00`;

        const gpa = sumTotalCredits ? ((totalCreditsGPA / sumTotalCredits) * 4 / 5).toFixed(2) : "0.00";
        gpaValue.textContent = `${gpa} / 4.00`;

        const mediaComum = (gpa * 2.5).toFixed(2);
        mediaValue.textContent = `${mediaComum} / 10.00`;
    }

    function printPage() {
        window.print();
    }
});
