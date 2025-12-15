class TypingTest {
    constructor() {
        this.paragraphs = [
            "Typing is an essential skill in the modern world. Practicing regularly helps improve your speed and accuracy. The more you type, the more confident you become, and soon you’ll be able to type without even looking at the keyboard.",
            "Learning to type efficiently can save you a lot of time in your daily work. Start slowly and focus on accuracy first. Remember, speed will come naturally as your fingers get used to the movements required for each key.",
            "Consistency is key when it comes to typing. Even dedicating just ten minutes a day to practice can make a huge difference over time. Set goals, track your progress, and celebrate your improvements along the way.",
            "Typing is not just about pressing keys quickly. It is about rhythm, posture, and finger placement. By paying attention to these details, you can prevent fatigue and develop a smooth, effortless typing style.",
            "With enough practice, you can type almost anything without looking at the keyboard. This skill opens up opportunities for faster communication, efficient coding, and easier writing. Keep practicing, and soon typing will feel natural."
        ];

        this.testDuration = 60;
        this.timer = null;
        this.startTime = null;
        this.isRunning = false;
        this.currentParagraph = '';
        this.paragraphIndex = 0;
        this.userInput = '';
        this.correctChars = 0;
        this.totalChars = 0;
        this.remainingTime = this.testDuration;

        this.initializeElements();
        this.bindEvents();
        this.createParticles();
    }

    initializeElements() {
        this.elements = {
            wpm: document.getElementById('wpm'),
            accuracy: document.getElementById('accuracy'),
            time: document.getElementById('time'),
            quote: document.getElementById('quote'),
            textarea: document.getElementById('textarea'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            grade: document.getElementById('grade'),
            progress: document.getElementById('progress')
        };
    }

    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => this.startTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.textarea.addEventListener('input', (e) => this.onInput(e));
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = particle.style.height = (Math.random() * 8 + 4) + 'px';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    startTest() {
        this.isRunning = true;
        this.paragraphIndex = Math.floor(Math.random() * this.paragraphs.length);
        this.currentParagraph = this.paragraphs[this.paragraphIndex];
        this.elements.quote.textContent = this.currentParagraph;
        this.elements.textarea.disabled = false;
        this.elements.textarea.focus();
        this.elements.textarea.value = '';
        this.elements.startBtn.disabled = true;
        this.elements.resetBtn.disabled = false;

        this.correctChars = 0;
        this.totalChars = 0;
        this.userInput = '';
        this.startTime = new Date();
        this.remainingTime = this.testDuration;

        this.updateDisplay();
        this.timer = setInterval(() => this.updateTimer(), 1000);
    }

    onInput(e) {
        if (!this.isRunning) return;

        this.userInput = e.target.value;
        this.totalChars = this.userInput.length;

        // Count total correct characters
        this.correctChars = 0;
        for (let i = 0; i < this.userInput.length; i++) {
            if (i < this.currentParagraph.length && this.userInput[i] === this.currentParagraph[i]) {
                this.correctChars++;
            }
        }

        this.updateDisplay();

        // Check if test completed early
        if (this.userInput === this.currentParagraph) {
            this.endTest();
        }
    }

    updateTimer() {
        this.remainingTime--;
        this.elements.time.textContent = this.remainingTime;

        const progress = ((this.testDuration - this.remainingTime) / this.testDuration) * 100;
        this.elements.progress.style.width = progress + '%';

        if (this.remainingTime <= 0) {
            this.endTest();
        }
    }

    endTest() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.elements.textarea.disabled = true;
        this.elements.startBtn.disabled = false;
        this.elements.resetBtn.disabled = false;

        const endTime = new Date();
        const timeElapsed = (endTime - this.startTime) / 1000 / 60; // in minutes
        const wpm = Math.round((this.correctChars / 5) / timeElapsed);
        const accuracy = Math.round((this.correctChars / this.totalChars) * 100) || 0;

        this.elements.wpm.textContent = wpm;
        this.elements.accuracy.textContent = accuracy;
        this.showGrade(wpm, accuracy);
    }

    showGrade(wpm, accuracy) {
        const gradeEl = this.elements.grade;
        let grade = 'C';
        let message = '';

        if (wpm >= 80 && accuracy >= 95) {
            grade = 'S';
            message = '🏆 Typing Legend!';
        } else if (wpm >= 60 && accuracy >= 90) {
            grade = 'A';
            message = '⭐ Excellent Typist!';
        } else if (wpm >= 40 && accuracy >= 85) {
            grade = 'B';
            message = '👍 Good Progress!';
        } else {
            grade = 'C';
            message = '💪 Keep Practicing!';
        }

        gradeEl.textContent = `${grade} - ${message} (${wpm} WPM, ${accuracy}%)`;
        gradeEl.className = `grade-badge grade-${grade.toLowerCase()}`;
        gradeEl.style.display = 'inline-block';
    }

    updateDisplay() {
        const timeElapsed = ((new Date() - this.startTime) / 1000) / 60;
        const currentWpm = Math.round((this.correctChars / 5) / timeElapsed || 0);
        this.elements.wpm.textContent = currentWpm;
        
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 0;
        this.elements.accuracy.textContent = accuracy;
    }

    resetTest() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.elements.textarea.value = '';
        this.elements.textarea.disabled = true;
        this.elements.startBtn.disabled = false;
        this.elements.resetBtn.disabled = true;
        this.elements.grade.style.display = 'none';
        this.elements.progress.style.width = '0%';
        
        this.elements.wpm.textContent = '0';
        this.elements.accuracy.textContent = '0';
        this.elements.time.textContent = this.testDuration;
    }
}

// Initialize the app
const typingTest = new TypingTest();