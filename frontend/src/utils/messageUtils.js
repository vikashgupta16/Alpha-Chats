import axios from 'axios';
import { serverUrl } from '../config/constants';

// API utility for marking messages as read
export const markMessagesAsReadAPI = async (senderId) => {
    try {
        console.log(`📖 [API] Marking messages as read from sender: ${senderId}`);
        
        const response = await axios.patch(
            `${serverUrl}/api/message/read/${senderId}`,
            {},
            { withCredentials: true }
        );
        
        console.log(`✅ [API] Messages marked as read successfully:`, response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [API] Error marking messages as read:', error);
        throw error;
    }
};

// Enhanced message utilities for coders
export const messageUtils = {
    // Format code snippets for display
    formatCodeSnippet: (code, language = 'javascript') => {
        return {
            code: code.trim(),
            language: language.toLowerCase(),
            lineCount: code.split('\n').length
        };
    },

    // Format terminal commands
    formatTerminalCommand: (command, output = '') => {
        return {
            command: command.trim(),
            output: output.trim(),
            timestamp: new Date().toISOString()
        };
    },

    // Common code templates for quick insertion
    codeTemplates: {
        react: {
            component: `import React from 'react';

const ComponentName = () => {
    return (
        <div>
            {/* Your content here */}
        </div>
    );
};

export default ComponentName;`,
            hook: `import { useState, useEffect } from 'react';

const useCustomHook = () => {
    const [state, setState] = useState(null);
    
    useEffect(() => {
        // Your effect logic here
    }, []);
    
    return { state, setState };
};

export default useCustomHook;`
        },
        javascript: {
            function: `function functionName(params) {
    // Your code here
    return result;
}`,
            async: `async function asyncFunction() {
    try {
        const result = await someAsyncOperation();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}`
        },
        node: {
            server: `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`,
            api: `app.get('/api/endpoint', async (req, res) => {
    try {
        // Your API logic here
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});`
        },
        python: {
            function: `def function_name(params):
    """
    Function description
    """
    # Your code here
    return result`,
            class: `class ClassName:
    def __init__(self, params):
        self.params = params
    
    def method_name(self):
        # Your method logic here
        pass`
        }
    },

    // Terminal command templates
    terminalTemplates: {
        git: [
            'git status',
            'git add .',
            'git commit -m "feat: add new feature"',
            'git push origin main',
            'git pull origin main',
            'git checkout -b feature/new-feature',
            'git merge feature/branch-name'
        ],
        npm: [
            'npm install',
            'npm start',
            'npm run build',
            'npm run dev',
            'npm test',
            'npm install package-name',
            'npm uninstall package-name'
        ],
        docker: [
            'docker build -t app-name .',
            'docker run -p 3000:3000 app-name',
            'docker ps',
            'docker stop container-id',
            'docker images',
            'docker-compose up',
            'docker-compose down'
        ],
        system: [
            'ls -la',
            'cd directory-name',
            'mkdir new-directory',
            'touch filename.ext',
            'cat filename.txt',
            'grep "pattern" filename.txt',
            'ps aux | grep process-name'
        ]
    }
};

export default messageUtils;
