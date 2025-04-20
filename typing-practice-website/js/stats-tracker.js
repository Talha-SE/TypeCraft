// Enhanced stats tracker with more detailed statistics and persistent storage

class StatsTracker {
    constructor() {
        this.stats = {
            totalTests: 0,
            totalTime: 0,
            totalErrors: 0,
            totalWordsTyped: 0,
            averageWPM: 0,
            highestWPM: 0,
            bestAccuracy: 100,
            recentTests: []
        };
        this.loadStats();
    }

    recordTest(wpm, timeTaken, errors, wordsTyped, accuracy) {
        this.stats.totalTests++;
        this.stats.totalTime += timeTaken;
        this.stats.totalErrors += errors;
        this.stats.totalWordsTyped += wordsTyped;
        
        // Update highest WPM
        if (wpm > this.stats.highestWPM) {
            this.stats.highestWPM = wpm;
        }
        
        // Update best accuracy
        if (accuracy > this.stats.bestAccuracy) {
            this.stats.bestAccuracy = accuracy;
        }
        
        // Calculate average WPM
        this.calculateAverageWPM();
        
        // Add to recent tests (keep last 10)
        const testRecord = {
            date: new Date().toISOString(),
            wpm,
            accuracy,
            errors,
            wordsTyped,
            timeTaken
        };
        
        this.stats.recentTests.unshift(testRecord);
        if (this.stats.recentTests.length > 10) {
            this.stats.recentTests.pop();
        }
        
        // Save updated stats
        this.saveStats();
        
        return testRecord;
    }

    calculateAverageWPM() {
        if (this.stats.totalTests > 0) {
            this.stats.averageWPM = Math.round(this.stats.totalWordsTyped / (this.stats.totalTime / 60));
        }
    }

    getStats() {
        return this.stats;
    }

    resetStats() {
        this.stats = {
            totalTests: 0,
            totalTime: 0,
            totalErrors: 0,
            totalWordsTyped: 0,
            averageWPM: 0,
            highestWPM: 0,
            bestAccuracy: 100,
            recentTests: []
        };
        this.saveStats();
    }

    saveStats() {
        localStorage.setItem('typingStats', JSON.stringify(this.stats));
    }

    loadStats() {
        const savedStats = localStorage.getItem('typingStats');
        if (savedStats) {
            try {
                const parsedStats = JSON.parse(savedStats);
                this.stats = { ...this.stats, ...parsedStats };
            } catch (e) {
                console.error('Error loading stats:', e);
            }
        }
    }

    getProgressData() {
        // Extract data for charting progress over time
        const dates = [];
        const wpmData = [];
        const accuracyData = [];
        
        // Use recent tests in reverse order (oldest to newest)
        const testsForChart = [...this.stats.recentTests].reverse();
        
        testsForChart.forEach(test => {
            const date = new Date(test.date);
            dates.push(`${date.getMonth()+1}/${date.getDate()}`);
            wpmData.push(test.wpm);
            accuracyData.push(test.accuracy);
        });
        
        return {
            dates,
            wpmData,
            accuracyData
        };
    }

    displayStatsOnPage() {
        const testsCompleted = document.getElementById('tests-completed');
        const averageWpm = document.getElementById('average-wpm');
        const accuracy = document.getElementById('accuracy');
        const statsTableBody = document.getElementById('stats-table-body');
        
        if (testsCompleted) testsCompleted.textContent = this.stats.totalTests;
        if (averageWpm) averageWpm.textContent = this.stats.averageWPM;
        if (accuracy) accuracy.textContent = `${this.stats.bestAccuracy}%`;
        
        // Fill in the table of recent tests
        if (statsTableBody) {
            statsTableBody.innerHTML = '';
            
            this.stats.recentTests.forEach(test => {
                const row = document.createElement('tr');
                const date = new Date(test.date);
                
                row.innerHTML = `
                    <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                    <td>${test.wpm}</td>
                    <td>${test.accuracy}%</td>
                `;
                
                statsTableBody.appendChild(row);
            });
            
            // If no tests yet, show message
            if (this.stats.recentTests.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="3">No tests completed yet. Start practicing!</td>
                `;
                statsTableBody.appendChild(row);
            }
        }

        // Create progress chart if chart library is available
        this.createProgressChart();
    }

    createProgressChart() {
        const chartContainer = document.getElementById('progress-chart');
        if (!chartContainer) return;
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            chartContainer.innerHTML = '<p>Chart library not loaded.</p>';
            return;
        }
        
        const progressData = this.getProgressData();
        
        // If no data, show message
        if (progressData.dates.length === 0) {
            chartContainer.innerHTML = '<p>Complete some typing tests to see your progress chart.</p>';
            return;
        }
        
        // Clear container
        chartContainer.innerHTML = '<canvas id="typingChart"></canvas>';
        
        // Create chart
        const ctx = document.getElementById('typingChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: progressData.dates,
                datasets: [
                    {
                        label: 'WPM',
                        data: progressData.wpmData,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Accuracy %',
                        data: progressData.accuracyData,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Words Per Minute'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        max: 100,
                        title: {
                            display: true,
                            text: 'Accuracy %'
                        }
                    }
                }
            }
        });
    }
}

// Create and export statsTracker instance
const statsTracker = new StatsTracker();

// If module exports are available (Node.js environment)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = statsTracker;
}