/**
 * Iddu AI Call Simulator
 * Simulates realistic health assistant phone call transcripts with hybrid synthesis.
 */

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-sim-btn');
    const complexBtn = document.getElementById('start-complex-sim-btn');
    const transcript = document.getElementById('sim-transcript');
    const audioToggleBtn = document.querySelector('.audio-toggle');
    
    if (!transcript) return;

    let isAudioEnabled = false;
    const synth = window.speechSynthesis;

    if (audioToggleBtn) {
        // Audio toggle is currently disabled
        audioToggleBtn.style.opacity = '0.4';
        audioToggleBtn.style.cursor = 'default';
        audioToggleBtn.title = 'Audio coming soon';
        audioToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Intentionally disabled
        });
    }

    const scenarios = {
        standard: [
            { role: 'AI Agent', text: 'Hello... um, this is Iddu, calling on behalf of Alex M. regarding an appointment at the Clinic.' },
            { role: 'Clinic', text: 'Hi... let me pull that up. Can you, uh, confirm the patient’s date of birth?' },
            { role: 'AI Agent', text: 'Certainly. Date of birth is... let me see... 05/xx/19xx and ' },
            { role: 'Clinic', text: 'Thank you... hmm, that matches. How can I help you today?' },
            { role: 'AI Agent', text: 'Alex needs to reschedule their follow-up for next Tuesday. Do you have anything, uh, available in the morning?' },
            { role: 'Clinic', text: 'Let me check... we have a 9:30 AM or a 10:45 AM.' },
            { role: 'AI Agent', text: '10:45 AM works perfectly for Alex. Please confirm that time.' },
            { role: 'Clinic', text: 'Okay, I have Alex moved to Tuesday at 10:45 AM. Anything else?' },
            { role: 'AI Agent', text: 'That completes it. Thank you for your help. Goodbye.' }
        ],
        complex: [
            { role: 'IVR', text: 'Welcome to the Clinic. Press 1 for Appointments, 2 for Billing.' },
            { role: 'AI Agent', text: 'Sending DTMF 1' },
            { role: 'IVR', text: 'Connecting you to the scheduling department.' },
            { role: 'Clinic', text: 'Appointments, how can I help you today?' },
            { role: 'AI Agent', text: 'Hello... um, this is Alex M.’s personal AI assistant. Alex needs to move his follow-up. He is looking for next week Tuesday or Wednesday... specifically between 2:00 PM and 4:00 PM.' },
            { role: 'Clinic', text: 'I can, uh, look into that. To protect the patient’s privacy, can you please verify the date of birth?' },
            { role: 'AI Agent', text: 'Of course. The date of birth is 11/xx/19xx ' },
            { role: 'Clinic', text: 'Great, thanks... Hmm, I don’t see any afternoon slots those days. But we actually had a cancellation this Friday at 3:15 PM? That’s sooner.' },
            { role: 'AI Agent', text: 'Alex specifically requested no Fridays. Could you check again for any Tuesday or Wednesday slots between 2:00 and 4:00 PM? He’s... uh, flexible within that window.' },
            { role: 'Clinic', text: 'Oh, you’re right... a slot just opened up. How about next Wednesday at 2:30 PM?' },
            { role: 'AI Agent', text: 'Wednesday at 2:30 PM is perfect. I have confirmed that in Alex’s calendar and notified him. Thank you!' },
            { role: 'Clinic', text: 'Perfect. You’re all set. Have a good one!' }
        ]
    };

    /**
     * Hybrid Speech Logic:
     * 1. Try playing premium pre-recorded MP3
     * 2. Fall back to SpeechSynthesis if MP3 is missing
     */
    const speakLine = (scenarioKey, index, text, role) => {
        return new Promise((resolve) => {
            if (!isAudioEnabled) return resolve();

            const audioPath = `assets/audio/${scenarioKey}/line_${index}.mp3`;
            const audio = new Audio(audioPath);

            audio.oncanplaythrough = () => {
                audio.play();
                audio.onended = resolve;
            };

            audio.onerror = () => {
                // Fallback to Live Synthesis
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = synth.getVoices();
                
                if (role === 'AI Agent') {
                    utterance.pitch = 1.1;
                    utterance.voice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) || voices[0];
                } else if (role === 'Clinic') {
                    utterance.pitch = 0.9;
                } else if (role === 'IVR') {
                    utterance.pitch = 0.5;
                }

                utterance.onend = resolve;
                utterance.onerror = resolve;
                synth.speak(utterance);
            };
        });
    };

    let isRunning = false;

    const runSimulation = async (scenarioKey) => {
        if (isRunning) return;
        isRunning = true;
        
        const scenario = scenarios[scenarioKey];
        const activeBtn = scenarioKey === 'standard' ? startBtn : complexBtn;
        const otherBtn = scenarioKey === 'standard' ? complexBtn : startBtn;
        
        const originalText = activeBtn.innerText;
        activeBtn.innerText = 'Simulation Running...';
        activeBtn.disabled = true;
        otherBtn.disabled = true;
        transcript.innerHTML = '';

        for (let i = 0; i < scenario.length; i++) {
            const line = scenario[i];
            const lineEl = document.createElement('div');
            lineEl.className = 'sim-line';
            
            let roleLabel = line.role;
            let roleClass = 'role-clinic';
            
            if (line.role === 'AI Agent') {
                roleClass = 'role-agent';
            } else if (line.role === 'IVR') {
                roleClass = 'role-ivr';
                roleLabel = 'SYSTEM';
            }
            
            lineEl.innerHTML = `
                <span class="sim-role ${roleClass}">${roleLabel.toUpperCase()}:</span>
                <span class="sim-text">${line.text}</span>
            `;
            
            transcript.appendChild(lineEl);
            transcript.scrollTop = transcript.scrollHeight;
            
            if (isAudioEnabled) {
                await speakLine(scenarioKey, i, line.text, line.role);
            } else {
                let delay = 1200 + (line.text.length * 25);
                if (line.role === 'IVR' || line.text.includes('DTMF')) delay = 800;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        activeBtn.innerText = 'Simulation Complete';
        setTimeout(() => {
            activeBtn.innerText = originalText;
            activeBtn.disabled = false;
            otherBtn.disabled = false;
            isRunning = false;
        }, 3000);
    };

    if (startBtn) startBtn.addEventListener('click', () => runSimulation('standard'));
    if (complexBtn) complexBtn.addEventListener('click', () => runSimulation('complex'));
    
    synth.getVoices();
});
