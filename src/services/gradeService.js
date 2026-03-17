export const gradeService = {
    calculateScore: (studentData, config) => {
        let totalScore = 0;

        // Calculate total weighted score
        config.components.forEach(comp => {
            const val = parseFloat(studentData[comp.name] || 0);
            // Logic assumes inputs are raw scores out of 100? Or raw scores?
            // "Weight (percentage)" usually implies component contributes X%
            // If user inputs score e.g. 15/20 ... how do we know max score?
            // Assumption: Input scores are already normalized to 100 or raw?
            // Prompt says: "Progressive Test – 20%"
            // Usually users enter e.g. 15. If it's out of 20, 15 is the contribution? 
            // OR they enter 75 (out of 100) and we take 20%?
            // Let's assume input is raw score out of 100 for now, so we take X%.
            // OR input is the weighted value directly?
            // Simplest for MVP: Input is raw value 0-100. We multiply by weight/100.

            const weightedVal = (val * comp.weight) / 100;
            totalScore += weightedVal;
        });

        // Determine Grade
        let grade = 'N/A';
        let remark = '';

        // Sort scales generally desc min, but we can just find match
        const found = config.gradingScale.find(scale => {
            // Range check. Max is inclusive or exclusive?
            // Prompt example: 80-100 (1). 60-79.99 (3).
            // Let's assume strictly: Min <= Score <= Max
            return totalScore >= parseFloat(scale.min) && totalScore <= parseFloat(scale.max);
        });

        if (found) {
            grade = found.grade;
            remark = config.remarks[grade] || '';
        }

        return {
            ...studentData,
            totalScore: totalScore.toFixed(2),
            grade,
            remark
        };
    }
};
