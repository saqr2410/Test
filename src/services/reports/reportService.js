import api from "../../api/axios";

export const getDashboardReport = async () => {
    const { data } = await api.get("/reports/dashboard/");
    return data;
};

export const getDailyReports = async () => {
    const { data } = await api.get("/reports/daily/");
    return data;
};

export const getMonthlyReports = async () => {
    const { data } = await api.get("/reports/monthly/");
    return data;
};

export const getLiveDailyReport = async () => {
    const { data } = await api.get("/reports/live/daily/");
    return data;
};

export const getTopProducts = async () => {
    const { data } = await api.get("/reports/live/top_products/");
    return data;
};

export const getLowStockReport = async () => {
    const { data } = await api.get("/reports/live/low_stock/");
    return data;
};