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

        update: [
            "OWNER",
            "MANAGER",
        ],

    },


    purchases: {

        view: [
            "OWNER",
            "MANAGER",
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
            "CASHIER",
        ],

        create: [
            "OWNER",
            "MANAGER",
            "CASHIER",
        ],

        update: [
            "OWNER",
            "MANAGER",
        ],

        delete: [
            "OWNER",
        ],

    },


    customers: {

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
        ],

        update: [
            "OWNER",
            "MANAGER",
        ],

        delete: [
            "OWNER",
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

        update: [
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

    },


    employees: {

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


    roles: {

        view: [
            "OWNER",
        ],

        update: [
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
            "CASHIER",
            "OWNER",
        ],

        create: [
            "CASHIER",
            "OWNER",
        ],

    },


    orders: {

        view: [
            "DELIVERY",
            "OWNER",
        ],

        update: [
            "DELIVERY",
            "OWNER",
        ],

    },

};


console.log(
    "ADMIN PERMISSIONS LOADED",
    ADMIN_PERMISSIONS
);