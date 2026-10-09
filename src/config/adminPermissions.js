export const ADMIN_PERMISSIONS = {
    dashboard: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "CASHIER",
            "ACCOUNTANT",
            "DELIVERY",
        ],
    },

    products: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
        create: [
            "OWNER",
            "MANAGER",
        ],
        update: [
            "OWNER",
            "MANAGER",
        ],
        delete: [
            "OWNER",
        ],
    },

    inventory: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
        adjust: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
    },

    purchases: {
        view: [
            "OWNER",
            "MANAGER",
            "ACCOUNTANT",
        ],
        create: [
            "OWNER",
            "MANAGER",
        ],
        update: [
            "OWNER",
            "MANAGER",
        ],
        delete: [
            "OWNER",
        ],
    },

    suppliers: {
        view: [
            "OWNER",
            "MANAGER",
            "ACCOUNTANT",
        ],
        create: [
            "OWNER",
            "MANAGER",
        ],
        update: [
            "OWNER",
            "MANAGER",
        ],
        delete: [
            "OWNER",
        ],
    },

    sales: {
        view: [
            "OWNER",
            "MANAGER",
            "ACCOUNTANT",
            "CASHIER",
        ],
        create: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "CASHIER",
        ],
        return: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
    },

    customers: {
        view: [
            "OWNER",
            "MANAGER",
        ],
        create: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
        update: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
        delete: [
            "OWNER",
        ],
    },


    healthProfiles: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],

        create: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],

        update: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],

        delete: [
            "OWNER",
            "MANAGER",
        ],
    },

    prescriptions: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
        create: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
        ],
        approve: [
            "OWNER",
            "PHARMACIST",
        ],
        reject: [
            "OWNER",
            "PHARMACIST",
        ],
        delete: [
            "OWNER",
        ],
    },

    finance: {
        view: [
            "OWNER",
            "ACCOUNTANT",
        ],
        create: [
            "OWNER",
            "ACCOUNTANT",
        ],
        update: [
            "OWNER",
            "ACCOUNTANT",
        ],
        delete: [
            "OWNER",
        ],
    },

    reports: {
        view: [
            "OWNER",
            "MANAGER",
            "ACCOUNTANT",
        ],
        export: [
            "OWNER",
            "MANAGER",
            "ACCOUNTANT",
        ],
    },

    employees: {
        view: [
            "OWNER",
            "MANAGER",
        ],
        create: [
            "OWNER",
        ],
        update: [
            "OWNER",
            "MANAGER",
        ],
        delete: [
            "OWNER",
        ],
    },

    roles: {
        view: [
            "OWNER",
        ],
        create: [
            "OWNER",
        ],
        update: [
            "OWNER",
        ],
        delete: [
            "OWNER",
        ],
    },

    notifications: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "CASHIER",
            "ACCOUNTANT",
            "DELIVERY",
        ],
        create: [
            "OWNER",
            "MANAGER",
        ],
    },

    settings: {
        view: [
            "OWNER",
        ],
        update: [
            "OWNER",
        ],
    },

    pos: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "CASHIER",
        ],
        create: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "CASHIER",
        ],
    },

    orders: {
        view: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "CASHIER",
            "DELIVERY",
        ],
        update: [
            "OWNER",
            "MANAGER",
            "PHARMACIST",
            "DELIVERY",
        ],
    },
};