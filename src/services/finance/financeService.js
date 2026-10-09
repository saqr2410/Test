import api from "../../api/axios";

export const getExpenses = async () => {
    try {
        const { data } = await api.get("/finance/expenses/");
        return data;
    } catch (error) {
        console.error("Expenses Error:", error);
        return [];
    }
};

export const createExpense = async (payload) => {
    const { data } = await api.post("/finance/expenses/", payload);
    return data;
};

export const updateExpense = async (id, payload) => {
    const { data } = await api.patch(`/finance/expenses/${id}/`, payload);
    return data;
};

export const deleteExpense = async (id) => {
    const { data } = await api.delete(`/finance/expenses/${id}/`);
    return data;
};

export const getProfit = async (date = null) => {
    try {
        const params = date ? { date } : {};
        const { data } = await api.get("/finance/profit/", { params });
        return data;
    } catch (error) {
        console.error("Profit Error:", error);
        return { income: 0, expenses: 0, profit: 0 };
    }
};

export const getCashSessions = async () => {
    const { data } = await api.get("/finance/cash-sessions/");
    return data;
};

export const openCashSession = async (payload) => {
    const { data } = await api.post("/finance/cash-sessions/", payload);
    return data;
};

export const closeCashSession = async (id, payload) => {
    const { data } = await api.patch(`/finance/cash-sessions/${id}/close/`, payload);
    return data;
};