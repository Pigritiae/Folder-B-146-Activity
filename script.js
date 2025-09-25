document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const conversationDisplay = document.getElementById('conversation-display');
    const choicesArea = document.getElementById('choices-area');
    const restartButton = document.getElementById('restart-button');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // --- Conversation Flow Data ---
    // Define the conversation nodes. Each node has a message and an array of choices.
    // Each choice has text and the ID of the next node.
    const conversationNodes = {
        'start': {
            message: 'Which Aspect of the Game do you need Help with?',
            choices: [
                { text: 'Agent Management', nextNodeId: 'agent_info' },
                { text: 'Abnormality Management', nextNodeId: 'abno_info' },
                { text: 'Core Suppressions', nextNodeId: 'core_info' },
                { text: 'Ordeal Suppression', nextNodeId: 'ordeal_info' }
            ]
        },
        'agent_info': {
            message: "What is your Issue with Agent Management?",
            choices: [
                { text: 'Difficulty with Training Specific Stats', nextNodeId: 'training_difficulty' },
                { text: 'Lob Points Investment', nextNodeId: 'lob_investment' },
                { text: 'How does it Work?', nextNodeId: 'training_mechanic' },
                { text: 'Back to Agent Issues', nextNodeId: 'agent_info' }
            ]
        },
        'training_difficulty': {
            message: 'Which Stat is your Most Difficult to Train?',
            choices: [
                { text: 'Fortitude', nextNodeId: 'fortitude_stat' },
                { text: 'Prudence', nextNodeId: 'prudence_stat' },
                { text: 'Temperance', nextNodeId: 'temperance_stat' },
                { text: 'Justice', nextNodeId: 'justice_stat' },
                { text: 'Back to Stat Issues', nextNodeId: 'stat_training' }
            ]
        },
        'fortitude_stat': {
            message: "Whether Their Management Difficulty or Abscence in your Facility, Here's a List of some Instinct Favoring Abnormalities: * T-01-54, * T-05-41, * O-04-08, * F-02-58, * O-02-74, * O-06-20, * T-01-75.",
            choices: [
                { text: 'Suggest Insight Favoring Abnos', nextNodeId: 'prudence_stat' },
                { text: 'Suggest Attachment Favoring Abnos', nextNodeId: 'temperance_stat' },
                { text: 'Suggest Repression Favoring Abnos', nextNodeId: 'justice_stat' },
                { text: 'Back to Training Issues', nextNodeId: 'stat_training' }
            ]
        },
        'prudence_stat': {
            message: "Whether Their Management Difficulty or Abscence in your Facility, Here's a List of some Insight Favoring Abnormalities: * O-02-56, * F-01-37, * F-02-49, * T-04-50, * O-05-102, * O-02-62, * O-03-93, * O-03-89",
            choices: [
                { text: 'Suggest Instinct Favoring Abnos', nextNodeId: 'fortitude_stat' },
                { text: 'Suggest Attachment Favoring Abnos', nextNodeId: 'temperance_stat' },
                { text: 'Suggest Repression Favoring Abnos', nextNodeId: 'justice_stat' },
                { text: 'Back to Training Issues', nextNodeId: 'stat_training' }
            ]
        },
        'temperance_stat': {
            message: "Whether Their Management Difficulty or Abscence in your Facility, Here's a List of some Attachment Favoring Abnormalities: * O-03-60, * O-01-67, * F-05-32, * O-02-40, * O-04-72, * O-06-20",
            choices: [
                { text: 'Suggest Instinct Favoring Abnos', nextNodeId: 'fortitude_stat' },
                { text: 'Suggest Insight Favoring Abnos', nextNodeId: 'prudence_stat' },
                { text: 'Suggest Repression Favoring Abnos', nextNodeId: 'justice_stat' },
                { text: 'Back to Training Issues', nextNodeId: 'stat_training' }
            ]
        },
        'justice_stat': {
            message: "Whether Their Management Difficulty or Abscence in your Facility, Here's a List of some Repression Favoring Abnormalities: * O-01-92, * F-01-69, * T-01-68, * F-02-70, * O-04-72, * T-01-75",
            choices: [
                { text: 'Suggest Instinct Favoring Abnos', nextNodeId: 'fortitude_stat' },
                { text: 'Suggest Insight Favoring Abnos', nextNodeId: 'prudence_stat' },
                { text: 'Suggest Attachment Favoring Abnos', nextNodeId: 'temperance_stat' },
                { text: 'Back to Training Issues', nextNodeId: 'stat_training' }
            ]
        },
        'lob_investment': {
            message: 'What is Your Issue with LOB Points Management?',
            choices: [
                { text: 'How to Spend them Well', nextNodeId: 'lob_spending' },
                { text: 'How to Gain More of Them', nextNodeId: 'lob_gaining' },
                { text: 'Back to Stat Issues', nextNodeId: 'stat_training' }
            ]
        },
        'training_mechanic': {
            message: "When your Agent Performs Work on an Abnormality, an Hidden Number Corresponding with the Work Type Increases. At the End of the Day, those Numbers Increase the Agent's Stats Correspondingly. Their Gain Depends on the Agent and Abnormality's Level and Risk Level Difference, Work Result and PE-Box Gain",
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, Any More Info about Agents?', nextNodeId: 'stat_training' }
            ]
        },
        'lob_spending': {
            message: "LOB Is Mainly Used to Increase Agent's Stats. The Cost Requirement for to Upgrade Starts at 1; 3 for Justice; and Triples with Each Stat Tier Above 1. Its Recommended to Prioritize Upgrading Temperance First, LOB or not, Focusing on Maxing out one or two Agents at a Time Rather than Having Many Agents and Spreading it Equally Among them",
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is All I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, Any More Advice on LOB Points?', nextNodeId: 'lob_investment' },
                { text: 'Thanks, Any More Info about Agents?', nextNodeId: 'stat_training' }
            ]
        },
        'lob_gaining': {
            message: 'LOB Gain is Based on the Day Count of your Facility, Multiplied by the Amount of Living Agents on the End of the Day, With a Rank Determining the Point Multiplier. The Base Amount is Tripled on Days that end in 3 or 5 and Doubled by the Rewards of Control Team Core Suppression. That Amount can be Deducted depending on Breaching Abnormalities, Determined by Amount and Risk Level.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, Any More Advice on LOB Points?', nextNodeId: 'lob_investment' },
                { text: 'Thanks, Any More Info about Agents?', nextNodeId: 'stat_training' }
            ]
        },
        'abno_info': {
            message: 'What is Your Issue With Abnormality Management?',
            choices: [
                { text: 'Difficulty to Suppress', nextNodeId: 'abno_suppress' },
                { text: 'Difficulty to Work with', nextNodeId: 'abno_work' },
                { text: 'Back to Start', nextNodeId: 'start' }
            ]
        },
        'abno_suppress': {
            message: 'Abnormalities Often have a Damage Type Weakness and Small Ranged AOE Attacks, Having a Strong Agent Fight them Head-to-Head while other Weaker Agents attack it from affair is an Effective Early Strategy. For Stronger Abnormalities, Where Tanking Damage is not an Effective Option, you can Move your Agent Around in Order to Avoid some of Their Lengthyer, Stronger Attacks, Healing them With Bullets if Necessary, while Still Having Some Agents Pepper the Abnormality From Afar.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, Any More Advice for Abnormalities?', nextNodeId: 'abno_info' }
            ]
        },
        'abno_work': {
            message: "All Abnormalities have a Favored Work Type or two, What the Game Doesn't Tell you Though is their Results Probability. Their Work Favors have a Base Value, Which is Based on the Working Agent's Corresponding Stat Tier, that is Then Increased by the Agent's Temperance Stat, at a rate of 0.5% per Stat Point. The Probability Numbers are Hidden by Default, but they Each have a Description for their Percentage Thresholds: 0-20% is Very Low, 20-45% is Low, 45-60% is Normal, 60-75% is High, and 75-95% is Very High. The Probability Chance cannot Exceed 95%.",
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, Any More Advice for Abnormalities?', nextNodeId: 'abno_info' }
            ]
        },
        'core_info': {
            message: 'What Core Suppression are you Having Trouble with?',
            choices: [
                { text: 'Control Team', nextNodeId: 'core_control' },
                { text: 'Info Team', nextNodeId: 'core_information' },
                { text: 'Training Team', nextNodeId: 'core_training' },
                { text: 'Safety Team', nextNodeId: 'core_safety' },
                { text: 'Central Team', nextNodeId: 'core_central' },
                { text: 'Disciplinary Team', nextNodeId: 'core_disciplinary' },
                { text: 'Welfare Team', nextNodeId: 'core_welfare' },
                { text: 'Record Team', nextNodeId: 'core_record' },
                { text: 'Extraction Team', nextNodeId: 'core_extraction' },
                { text: 'Back to Start', nextNodeId: 'start' }
            ]
        },
        'core_control': {
            message: 'The Work Types Scrambling is Randomly Determined and Changes with Every Even Qliphoth Meltdown. Figure them Out by Working on Easy, non-punishing Abnormalities when The Work Types Scramble and Reach the Quota and Qliphoth Meltdown Threshold.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_information': {
            message: 'This is the Easiest Core Suppresion. There is not Much Advice to Give, Besides Familiarizing yourself with the Graphics and using the Zoom Function to Spot Ordeals or Breaching Abnormalities.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_training': {
            message: 'The Agents Stats are Reduced by 15 with Every Even Qliphoth Meltdown. Having a Few Strong, Maxed-out Agents rather than Many Weaker ones is the Key to Beating this Meltdown.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_safety': {
            message: 'All Healing is Disabled, Except from Army in Black, and is Distributed in Full only on Every Qliphoth Meltdown. Be Cautious of Abnormalities that Have Less than High-Very High Success Chances or are Difficult to Work with, that Damage can Accumulate.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_central': {
            message: 'All Department Qliphoth Immunities are Disabled. The Only Real Threat Here is the Obligatory Midnight Ordeal, So Either Retry the Day until you get Green Midnight (the Easiest one) or Have your Agents Advance the Qliphoth Meltdown Meter Before the Midnight Ordeal can Wreak any Havoc.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_disciplinary': {
            message: '',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_welfare': {
            message: "A Random Damage type taken by Agents is Multiplied by 4 with Every Qliphoth Meltdown, Adding one more at Every 3 Qliphoth Meltdowns. Be Careful with What Abnormalities you Work with and the Agent's Resistances, and What Damage Type Ordeals or Breaching Abnormalities Do.",
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_record': {
            message: 'Pausing and Time Acceleration is Disabled. Time is Forcibly Accelerated at Certain Qliphoth Meldown Thresholds, There is Also an Obligatory Midnight Ordeal, Pausing Time will Either Kill or Panic a Random Agent in the Facility, Subsequent Attempts will Affect 1 more Agent, you can still Open the Pause Menu with ESC, but not Actually Operate the Facility there.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'core_extraction': {
            message: 'An Suppressable Boss Enemy. She Uses a Facility Wide Spike Attack and Causes Meltdowns All over the Facility, and Also Causing Meltdowns Whenever she Approaches a Containment Unit. Split up your Agents from their Departments Immediatly, have a Group of them to Suppress the Arbiter and 2-3 Agents in Each Department to Take Care of the Meltdowns, Prioritizing Meltdowns of Fog. The Arbiter Has Lengthy, yet Deadly, Attack Animations, Move your Agent Kill Group to Avoid Them. She Repeats her Qliphoth Spike Attack at 70%. At 30% HP, the Attack is A Octo-directional Pillar Attack that is Way Longer, Disables Stopping Time, and Makes her Immune to All Damage, Requiring you to Deal with All Meltdowns of Fog to Even Damage her and Cancel her Attack, Backwards Clock is Highly Recommended for This Phase.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Core Suppressions', nextNodeId: 'core_info' }
            ]
        },
        'ordeal_info': {
            message: 'What Ordeal Are you Having Trouble with?',
            choices: [
                { text: 'Amber', nextNodeId: 'amber_info' },
                { text: 'Green', nextNodeId: 'green_info' },
                { text: 'Crimson', nextNodeId: 'crimson_info' },
                { text: 'Violet', nextNodeId: 'violet_info' },
                { text: 'Indigo', nextNodeId: 'indigo_info' },
                { text: 'White', nextNodeId: 'white_info' }
            ]
        },
        'amber_info': {
            message: 'This Ordeal is Mostly Weak to Red Damage. The Small Worms can be Annoying if your Agents have Slow, Short Ranged Weapons, the Big Worms Should be Attacked from Behind if your Agents have Red Resist higher than 0.4 and less than 80 HP, and for the Biggest Worm, you should have all of your Agents waiting in the elevators Next to Safety or Training Department and wait for one to Emerge in them, Attack it With your Agents, Retreat when They Are About to Spit the Big Worms, and Repeat the Process until They are Both Dead. Big Worms Spawned from the Biggest one will Automatically Die if they Took no Damage.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Ordeals', nextNodeId: 'ordeal_info' }
            ]
        },
        'green_info': {
            message: "This Ordeal is Mostly Weak to Black Damage. The Individual Robots Are only an Issue depending on your Agent's Equipment. The Dispensers Should Mainly Be Taken out one at a Time. The Midnight Laser Weapon Will ALWAYS Spawn in Info Department and Will Fire its Laser in From Top to a Clockwise Rotation, the Agents can Avoid that Laser By Going up or Down an Elevator, Do Not use weapons with Very Short Range against the Laser, that Would Have the Agent Standing Right on Top of the Laser.",
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Ordeals', nextNodeId: 'ordeal_info' }
            ]
        },
        'crimson_info': {
            message: 'This Ordeal is Mostly Weak to White Damage. The Small Clowns have to be Killed Fast, have at least 1 Agent with a White Damage Weapon and Enough Justice in Each Department to Kill them before they Lower Any Qliphoth Counter, Der Freischutz Bullets can Also Kill them Instantly, The Dusk Clowns will only Stop Rolling and Attack normally when They are in the Same Room as an Agent.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Ordeals', nextNodeId: 'ordeal_info' }
            ]
        },
        'violet_info': {
            message: 'This Ordeal is Mostly Weak to White Damage. The Orbs and Monolith have to be Killed Fast, they Deal Negligible Damage Any Decent Agent Should be Able to Kill the Blobs and Monolith, when Grouped up. The Monoliths only Spawn in the Upper Layer Departments and Upper Central Command, The Rooms other than the Corridors, There is a Bug where their Landing Attack does not Work on Agents that are from a Department Different from the One they have Landed On. The Midnight Monoliths All Have a Different Damage Weakness and Use their Attacks randomly Across the Facility or near them When their Health reaches 70%, 30%, and 10% HP.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Ordeals', nextNodeId: 'ordeal_info' }
            ]
        },
        'indigo_info': {
            message: "This Ordeal is Weak to White Damage. The Sweepers Are Only an Issue if your Agent's Equipment is HE Level or Lower, They Also Tend to Split Up, Facilitating their Suppression.",
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Ordeals', nextNodeId: 'ordeal_info' }
            ]
        },
        'white_info': {
            message: 'This Ordeal has Varying Damage Weaknesses. The Fixers have Attacks and Damage Immunity Corresponding to their Type and on Death Attacks. The Claw can be Easily Beaten by Grouping up all Agents in your Facility and Attacking him all at Once, that Forces him into his Lenghty Animations Again and Again, not letting him Fight back.',
            choices: [
                { text: 'Thanks, I Still have Some More Questions', nextNodeId: 'start' },
                { text: 'Thanks, That is all I Wanted to Know.', nextNodeId: 'end_conversation' },
                { text: 'Thanks, I Would like Some More Advice on Ordeals', nextNodeId: 'ordeal_info' }
            ]
        },
        'end_conversation': {
            message: "You're Welcome. Face the Fear and Build the Future.",
            choices: [
                { text: 'Start new Conversation', nextNodeId: 'start' }
            ]
        }
    };

    let currentNodeId = 'start'; // Start with the 'start' node

    // --- Helper Functions ---

    /**
     * Displays a message box with a given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    /**
     * Hides the message box.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Adds a message to the conversation display.
     * @param {string} text - The message text.
     * @param {string} sender - 'bot' or 'user'.
     */
    function addMessageToDisplay(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        conversationDisplay.appendChild(messageDiv);
        // Scroll to the bottom to show the latest message
        conversationDisplay.scrollTop = conversationDisplay.scrollHeight;
    }

    /**
     * Displays the current conversation node (message and choices).
     * @param {string} nodeId - The ID of the node to display.
     */
    function displayNode(nodeId) {
        const node = conversationNodes[nodeId];
        if (!node) {
            addMessageToDisplay('Erro: Nó de conversa não encontrado.', 'bot');
            choicesArea.innerHTML = ''; // Clear choices
            return;
        }

        addMessageToDisplay(node.message, 'bot');
        choicesArea.innerHTML = ''; // Clear previous choices

        node.choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-button');
            button.textContent = choice.text;
            button.addEventListener('click', () => handleChoice(choice.text, choice.nextNodeId));
            choicesArea.appendChild(button);
        });
    }

    /**
     * Handles a user's choice, adds it to display, and moves to the next node.
     * @param {string} choiceText - The text of the choice made by the user.
     * @param {string} nextNodeId - The ID of the next conversation node.
     */
    function handleChoice(choiceText, nextNodeId) {
        addMessageToDisplay(choiceText, 'user'); // Display user's choice
        currentNodeId = nextNodeId; // Update current node
        displayNode(currentNodeId); // Display the next node
    }

    /**
     * Restarts the conversation from the beginning.
     */
    function restartConversation() {
        if (confirm('Are you Sure you Want to Restart the Conversation')) {
            conversationDisplay.innerHTML = ''; // Clear all messages
            addMessageToDisplay('Welcome to Lob Corp Help Bot!', 'bot'); // Initial message
            currentNodeId = 'start'; // Reset to start node
            displayNode(currentNodeId); // Display the start node
        }
    }

    // --- Event Listeners ---
    restartButton.addEventListener('click', restartConversation);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // --- Initialization ---
    displayNode(currentNodeId); // Start the conversation
});
