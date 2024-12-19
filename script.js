document.addEventListener('DOMContentLoaded', function () {
    const consumerTypeInput = document.getElementById('consumer-type');
    const startMatrixInputButton = document.getElementById('start-matrix-input');
    const submitCriteriaButton = document.getElementById('submit-criteria');
    const submitOptionsButton = document.getElementById('submit-options');
    const submitRatingsButton = document.getElementById('submit-ratings');
    const optionsInput = document.getElementById('options-input');
    const ratingList = document.getElementById('rating-list');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');

    let criteriaMatrix = [];
    let options = [];
    let ratings = {};
    let criteriaWeights = {};

    startMatrixInputButton.addEventListener('click', function () {
        // 这里不再验证消费类型是否为1或2
        document.getElementById('criteria-section').classList.remove('hidden');
    });

    // 提交标准比较矩阵
  submitCriteriaButton.addEventListener('click', function () {
    // 创建8x8的比较矩阵
    criteriaMatrix = [
        [1, parseInt(document.getElementById('matrix-1-2').value), parseInt(document.getElementById('matrix-1-3').value), parseInt(document.getElementById('matrix-1-4').value), parseInt(document.getElementById('matrix-1-5').value), parseInt(document.getElementById('matrix-1-6').value), parseInt(document.getElementById('matrix-1-7').value), parseInt(document.getElementById('matrix-1-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-2').value), 1, parseInt(document.getElementById('matrix-2-3').value), parseInt(document.getElementById('matrix-2-4').value), parseInt(document.getElementById('matrix-2-5').value), parseInt(document.getElementById('matrix-2-6').value), parseInt(document.getElementById('matrix-2-7').value), parseInt(document.getElementById('matrix-2-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-3').value), 1 / parseInt(document.getElementById('matrix-2-3').value), 1, parseInt(document.getElementById('matrix-3-4').value), parseInt(document.getElementById('matrix-3-5').value), parseInt(document.getElementById('matrix-3-6').value), parseInt(document.getElementById('matrix-3-7').value), parseInt(document.getElementById('matrix-3-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-4').value), 1 / parseInt(document.getElementById('matrix-2-4').value), 1 / parseInt(document.getElementById('matrix-3-4').value), 1, parseInt(document.getElementById('matrix-4-5').value), parseInt(document.getElementById('matrix-4-6').value), parseInt(document.getElementById('matrix-4-7').value), parseInt(document.getElementById('matrix-4-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-5').value), 1 / parseInt(document.getElementById('matrix-2-5').value), 1 / parseInt(document.getElementById('matrix-3-5').value), 1 / parseInt(document.getElementById('matrix-4-5').value), 1, parseInt(document.getElementById('matrix-5-6').value), parseInt(document.getElementById('matrix-5-7').value), parseInt(document.getElementById('matrix-5-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-6').value), 1 / parseInt(document.getElementById('matrix-2-6').value), 1 / parseInt(document.getElementById('matrix-3-6').value), 1 / parseInt(document.getElementById('matrix-4-6').value), 1 / parseInt(document.getElementById('matrix-5-6').value), 1, parseInt(document.getElementById('matrix-6-7').value), parseInt(document.getElementById('matrix-6-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-7').value), 1 / parseInt(document.getElementById('matrix-2-7').value), 1 / parseInt(document.getElementById('matrix-3-7').value), 1 / parseInt(document.getElementById('matrix-4-7').value), 1 / parseInt(document.getElementById('matrix-5-7').value), 1 / parseInt(document.getElementById('matrix-6-7').value), 1, parseInt(document.getElementById('matrix-7-8').value)],
        [1 / parseInt(document.getElementById('matrix-1-8').value), 1 / parseInt(document.getElementById('matrix-2-8').value), 1 / parseInt(document.getElementById('matrix-3-8').value), 1 / parseInt(document.getElementById('matrix-4-8').value), 1 / parseInt(document.getElementById('matrix-5-8').value), 1 / parseInt(document.getElementById('matrix-6-8').value), 1 / parseInt(document.getElementById('matrix-7-8').value), 1]
    ];

    // 计算标准权重
    const rowSums = criteriaMatrix.map(row => row.reduce((a, b) => a + b, 0));
    const normalizedMatrix = criteriaMatrix.map((row, i) => row.map(value => value / rowSums[i]));
    const criteriaSums = normalizedMatrix[0].map((_, colIndex) => normalizedMatrix.map(row => row[colIndex]).reduce((a, b) => a + b, 0));
    criteriaWeights = criteriaSums.map(sum => sum / criteriaSums.length);

    // 隐藏矩阵输入区，展示选项输入区
    document.getElementById('options-section').classList.remove('hidden');
});

    submitOptionsButton.addEventListener('click', function () {
        options = optionsInput.value.trim().split(' ');
        ratingList.innerHTML = '';
        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.innerHTML = `<h4>${option}</h4>
                <label>奢侈性评分：<input type="number" id="${option}-1" min="1" max="9"></label><br>
                <label>品牌价值评分：<input type="number" id="${option}-2" min="1" max="9"></label><br>
                <label>社会影响评分：<input type="number" id="${option}-3" min="1" max="9"></label><br>
                <label>独特性评分：<input type="number" id="${option}-4" min="1" max="9"></label><br>
                <label>创新性评分：<input type="number" id="${option}-5" min="1" max="9"></label><br>
                <label>情感连接评分：<input type="number" id="${option}-6" min="1" max="9"></label><br>
                <label>身份象征评分：<input type="number" id="${option}-7" min="1" max="9"></label><br>
                <label>社会地位评分：<input type="number" id="${option}-8" min="1" max="9"></label><br>
            `;
            ratingList.appendChild(optionDiv);
        });
        
        // 显示评分输入部分
        document.getElementById('rating-section').classList.remove('hidden');
    });
submitRatingsButton.addEventListener('click', function () {
        options.forEach(option => {
            ratings[option] = criteriaWeights.reduce((sum, weight, index) => {
                const score = parseInt(document.getElementById(`${option}-${index + 1}`).value) || 1;
                return sum + (score * weight);
            }, 0);
        });

        // 计算每个选项的权重（选项得分 / 所有选项得分之和）
        const totalScores = Object.values(ratings).reduce((a, b) => a + b, 0);
        const normalizedRatings = {};
        Object.keys(ratings).forEach(option => {
            normalizedRatings[option] = ratings[option] / totalScores;
        });

        const bestOption = Object.keys(normalizedRatings).reduce((best, option) => normalizedRatings[option] > normalizedRatings[best] ? option : best);
        resultContent.innerHTML = `最佳决策是：${bestOption}，权重为 ${normalizedRatings[bestOption].toFixed(4)}`;
        resultSection.classList.remove('hidden');
    });
});
