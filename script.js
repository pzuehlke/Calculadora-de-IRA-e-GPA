document.addEventListener("DOMContentLoaded", function() {
    // Grabbing elements by their IDs for future use:
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

    let semesterCount = 0; // Track the number of semesters

    // Mapping grade strings to numerical values:
    const gradeValues = {
        SS: 5,
        MS: 4,
        MM: 3,
        MI: 2,
        II: 1,
        SR: 0
    };

    // Initialize the table with 8 periods on page load:
    for (let i = 1; i <= 8; i++) {
        addSemester();
    }

    // Adding event listeners to buttons:
    addSemesterButton.addEventListener("click", addSemester);
    removeSemesterButton.addEventListener("click", removeSemester);
    printPageButton.addEventListener("click", printPage);

    function addSemester() {
        semesterCount++; // Increment semester count

        // Create a new row for the semester:
        const row = document.createElement("tr");
        row.id = `semester-${semesterCount}`;
        
        // Create and append the semester number cell:
        const semesterCell = document.createElement("td");
        semesterCell.textContent = `${semesterCount}º`;
        row.appendChild(semesterCell);

        // Create and append cells for each grade type:
        ['SS', 'MS', 'MM', 'MI', 'II', 'SR'].forEach(credit => {
            const creditCell = document.createElement("td");
            const creditInput = document.createElement("input");
            creditInput.type = "number";
            creditInput.min = 0;
            creditInput.max = 99;
            creditInput.placeholder = credit; // Set placeholder text to grade type
            creditInput.addEventListener("input", updateIRA); // Update IRA on input change
            creditCell.appendChild(creditInput);
            row.appendChild(creditCell);
        });

        // Create and append the total credits cell for the semester:
        const totalCreditsCell = document.createElement("td");
        totalCreditsCell.id = `total-credits-${semesterCount}`;
        totalCreditsCell.textContent = '0'; // Initialize with zero
        row.appendChild(totalCreditsCell);

        semesterBody.appendChild(row); // Append the new row to the table body
    }

    function removeSemester() {
        if (semesterCount > 0) { // Ensure there's at least one semester to remove
            const row = document.getElementById(`semester-${semesterCount}`);
            semesterBody.removeChild(row);
            semesterCount--; // Decrement semester count
            updateIRA();  // Recalculate IRA after removing a period
        }
    }

    function updateIRA() {
        let totalWeightedCredits = 0;
        let totalWeight = 0;
        let totalCreditsGPA = 0;

        // Initialize sums for each grade type:
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
            const weight = Math.min(i, 6); // Weight is the semester number, capped at 6

            let semesterCredits = 0;

            inputs.forEach(input => {
                const value = parseFloat(input.value) || 0; // Get input value or default to 0
                const grade = input.placeholder; // Get grade type from placeholder
                const gradeValue = gradeValues[grade] || 0; // Get numerical value for grade
                totalWeightedCredits += value * weight * gradeValue; // Accumulate weighted credits
                totalWeight += value * weight; // Accumulate weight
                totalCreditsGPA += value * gradeValue; // Accumulate total credits for GPA
                semesterCredits += value; // Accumulate credits for the semester

                // Update sums for total row:
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

            sumTotalCredits += semesterCredits; // Accumulate total credits
            document.getElementById(`total-credits-${i}`).textContent = semesterCredits; // Update semester credits display
        }

        // Update totals for each grade type:
        totalSs.textContent = sumSs;
        totalMs.textContent = sumMs;
        totalMm.textContent = sumMm;
        totalMi.textContent = sumMi;
        totalIi.textContent = sumIi;
        totalSr.textContent = sumSr;
        totalCredits.textContent = sumTotalCredits;

        // Calculate and display IRA, GPA, and common average:
        const ira = totalWeight ? (totalWeightedCredits / totalWeight).toFixed(2) : "0.00";
        iraValue.textContent = `${ira} / 5.00`;

        const gpa = sumTotalCredits ? ((totalCreditsGPA / sumTotalCredits) * 4 / 5).toFixed(2) : "0.00";
        gpaValue.textContent = `${gpa} / 4.00`;

        const mediaComum = (gpa * 2.5).toFixed(2);
        mediaValue.textContent = `${mediaComum} / 10.00`;
    }

    function printPage() {
        window.print(); // Print the page
    }
});
