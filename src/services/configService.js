import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'exam_report_configs';

export const configService = {
    getAll: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    getById: (id) => {
        const configs = configService.getAll();
        return configs.find(c => c.id === id);
    },

    create: (config) => {
        const configs = configService.getAll();
        const newConfig = { ...config, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        configs.push(newConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
        return newConfig;
    },

    update: (id, updates) => {
        const configs = configService.getAll();
        const index = configs.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Config not found');

        const updatedConfig = { ...configs[index], ...updates, updatedAt: new Date().toISOString() };
        configs[index] = updatedConfig;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
        return updatedConfig;
    },

    delete: (id) => {
        const configs = configService.getAll();
        const newConfigs = configs.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs));
    }
};
