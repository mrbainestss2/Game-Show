:root {
    --primary: #FFD700;
    --bg: #2E0854;
    --box-bg: #4A1D66;
    --correct: #2ECC71;
    --wrong: #C70039;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg);
    background-image: linear-gradient(to bottom, var(--bg), #1a0530);
    color: white;
    margin: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

/* Modal */
.modal {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); z-index: 1000;
    display: flex; justify-content: center; align-items: center;
}
.modal-content {
    background: #fff; color: #333; padding: 30px; border-radius: 10px;
    max-width: 500px; text-align: center; border: 5px solid var(--primary);
}
.btn-start {
    background: var(--correct); color: white; padding: 15px 30px;
    font-size: 1.2rem; border: none; border-radius: 5px; cursor: pointer;
    margin-top: 20px;
}

/* Header & Timer */
header { text-align: center; margin-bottom: 20px; width: 100%; max-width: 800px; }
.header-banner { width: 100%; border-radius: 15px; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }

.timer-container {
    width: 100%; height: 10px; background: #333; margin-top: 15px;
    border-radius: 5px; overflow: hidden;
}
.timer-bar {
    height: 100%; width: 100%; background: var(--primary);
    transition: width 1s linear;
}

.balance-display {
    font-size: 3rem; font-weight: bold; color: var(--primary);
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.6); margin: 10px 0;
}

.status-bar {
    background: #333; padding: 10px; border-radius: 8px;
    display: flex; justify-content: space-between; font-size: 1.2rem;
}
.remaining-msg { color: #FFC300; }

/* Grid */
.grid-container {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    width: 100%; max-width: 800px; margin-bottom: 30px;
}

/* Mobile Responsive: Stack columns on small screens */
@media (max-width: 600px) {
    .grid-container { grid-template-columns: 1fr; }
    .balance-display { font-size: 2rem; }
}

.drop-box {
    background-color: var(--box-bg);
    border: 3px solid #5A2D76; border-radius: 15px; padding: 20px;
    text-align: center; position: relative; transition: all 0.3s ease;
    overflow: hidden; /* Important for drop animation */
}
.drop-box.active { border-color: var(--primary); box-shadow: 0 0 15px var(--primary); }
.drop-box.winner { border-color: var(--correct); background-color: rgba(46, 204, 113, 0.2); }

/* The Drop Animation */
@keyframes dropDown {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(200px); opacity: 0; }
}

.drop-box.loser {
    border-color: var(--wrong);
    background-color: #111; /* Dark hole appearance */
}
.drop-box.loser .amount-input, 
.drop-box.loser .quick-add {
    animation: dropDown 0.6s ease-in forwards; /* Things fall down */
}

/* Box Content */
.box-label {
    font-size: 2rem; font-weight: bold; display: inline-block;
    margin-bottom: 10px; color: var(--primary); cursor: pointer;
    padding: 5px 15px; border-radius: 5px; transition: all 0.2s;
}
.box-label:hover { background-color: rgba(255, 215, 0, 0.1); transform: scale(1.1); }

.amount-input {
    width: 80%; padding: 10px; font-size: 1.5rem; text-align: center;
    background: #2E0854; border: 2px solid #5A2D76; color: white; border-radius: 5px;
}

/* Quick Add Buttons */
.quick-add { margin-top: 10px; display: flex; justify-content: center; gap: 5px; flex-wrap: wrap; }
.quick-add button {
    padding: 5px 10px; font-size: 0.8rem; background: #5A2D76; color: white;
    border: none; border-radius: 3px; cursor: pointer;
}
.quick-add button:hover { background: var(--primary); color: black; }
.quick-add .btn-all-in { background: var(--primary); color: black; font-weight: bold; }
.quick-add .btn-clear { background: var(--wrong); }

/* Controls */
.controls {
    background: #3D1E2F; padding: 20px; border-radius: 10px;
    width: 100%; max-width: 800px; border-top: 4px solid var(--primary);
}
button.btn-next, button.btn-reset {
    padding: 12px 24px; font-size: 1.1rem; width: 100%;
    border: none; border-radius: 5px; font-weight: bold; cursor: pointer;
}
.btn-next { background-color: var(--correct); color: white; display: none; }
.btn-reset { background-color: var(--wrong); color: white; margin-top: 10px; }
#startAmount { padding: 10px; font-size: 1.1rem; border-radius: 5px; background: #2E0854; color: white; border: 2px solid #5A2D76; }
