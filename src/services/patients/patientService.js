import api from "../../api/axios";

const PATIENTS_URL = "/patients";

const patientService = {
    getPatients: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/`,
            { params }
        );

        return response.data;
    },

    getPatient: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/${id}/`
        );

        return response.data;
    },

    getPatientDetails: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/${id}/full-profile/`
        );

        return response.data;
    },

    getFullProfile: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/${id}/full-profile/`
        );

        return response.data;
    },

    getMyProfile: async () => {
        const response = await api.get(
            `${PATIENTS_URL}/my-profile/`
        );

        return response.data;
    },

    createPatient: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/`,
            data
        );

        return response.data;
    },

    updatePatient: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/${id}/`,
            data
        );

        return response.data;
    },

    deletePatient: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/${id}/`
        );

        return response.data;
    },

    getChronicDiseases: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/chronic-diseases/`,
            { params }
        );

        return response.data;
    },

    createChronicDisease: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/chronic-diseases/`,
            data
        );

        return response.data;
    },

    updateChronicDisease: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/chronic-diseases/${id}/`,
            data
        );

        return response.data;
    },

    deleteChronicDisease: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/chronic-diseases/${id}/`
        );

        return response.data;
    },

    getPatientDiseases: async (patientId) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-diseases/`,
            {
                params: {
                    patient: patientId,
                },
            }
        );

        return response.data;
    },

    createPatientDisease: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/patient-diseases/`,
            data
        );

        return response.data;
    },

    updatePatientDisease: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/patient-diseases/${id}/`,
            data
        );

        return response.data;
    },

    deletePatientDisease: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/patient-diseases/${id}/`
        );

        return response.data;
    },

    getFitnessProfiles: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/fitness-profiles/`,
            { params }
        );

        return response.data;
    },

    getFitnessProfile: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/fitness-profiles/${id}/`
        );

        return response.data;
    },

    updateFitnessProfile: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/fitness-profiles/${id}/`,
            data
        );

        return response.data;
    },

    deleteFitnessProfile: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/fitness-profiles/${id}/`
        );

        return response.data;
    },

    getNutritionProfiles: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/nutrition-profiles/`,
            { params }
        );

        return response.data;
    },

    getNutritionProfile: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/nutrition-profiles/${id}/`
        );

        return response.data;
    },

    updateNutritionProfile: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/nutrition-profiles/${id}/`,
            data
        );

        return response.data;
    },

    deleteNutritionProfile: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/nutrition-profiles/${id}/`
        );

        return response.data;
    },

    getPregnancyProfiles: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/pregnancy-profiles/`,
            { params }
        );

        return response.data;
    },

    getPregnancyProfile: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/pregnancy-profiles/${id}/`
        );

        return response.data;
    },

    updatePregnancyProfile: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/pregnancy-profiles/${id}/`,
            data
        );

        return response.data;
    },

    deletePregnancyProfile: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/pregnancy-profiles/${id}/`
        );

        return response.data;
    },

    getChildProfiles: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/child-profiles/`,
            { params }
        );

        return response.data;
    },

    getChildProfile: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/child-profiles/${id}/`
        );

        return response.data;
    },

    updateChildProfile: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/child-profiles/${id}/`,
            data
        );

        return response.data;
    },

    deleteChildProfile: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/child-profiles/${id}/`
        );

        return response.data;
    },

    getMedications: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-medications/`,
            { params }
        );

        return response.data;
    },

    getPatientMedications: async (patientId) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-medications/`,
            {
                params: {
                    patient: patientId,
                },
            }
        );

        return response.data;
    },

    createMedication: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/patient-medications/`,
            data
        );

        return response.data;
    },

    updateMedication: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/patient-medications/${id}/`,
            data
        );

        return response.data;
    },

    deleteMedication: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/patient-medications/${id}/`
        );

        return response.data;
    },

    getAdvices: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-advices/`,
            { params }
        );

        return response.data;
    },

    createAdvice: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/patient-advices/`,
            data
        );

        return response.data;
    },

    updateAdvice: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/patient-advices/${id}/`,
            data
        );

        return response.data;
    },

    deleteAdvice: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/patient-advices/${id}/`
        );

        return response.data;
    },

    getVisits: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-visits/`,
            { params }
        );

        return response.data;
    },

    getPatientVisits: async (patientId) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-visits/`,
            {
                params: {
                    patient: patientId,
                },
            }
        );

        return response.data;
    },

    createVisit: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/patient-visits/`,
            data
        );

        return response.data;
    },

    updateVisit: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/patient-visits/${id}/`,
            data
        );

        return response.data;
    },

    deleteVisit: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/patient-visits/${id}/`
        );

        return response.data;
    },

    getFollowUps: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-follow-ups/`,
            { params }
        );

        return response.data;
    },

    getFollowUp: async (id) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-follow-ups/${id}/`
        );

        return response.data;
    },

    getPatientFollowUps: async (patientId) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-follow-ups/patient/${patientId}/`
        );

        return response.data;
    },

    createFollowUp: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/patient-follow-ups/`,
            data
        );

        return response.data;
    },

    updateFollowUp: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/patient-follow-ups/${id}/`,
            data
        );

        return response.data;
    },

    deleteFollowUp: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/patient-follow-ups/${id}/`
        );

        return response.data;
    },

    getFollowUpProducts: async (followUpId) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-follow-ups/${followUpId}/products/`
        );

        return response.data;
    },

    getFollowUpProductsList: async (params = {}) => {
        const response = await api.get(
            `${PATIENTS_URL}/patient-follow-up-products/`,
            { params }
        );

        return response.data;
    },

    createFollowUpProduct: async (data) => {
        const response = await api.post(
            `${PATIENTS_URL}/patient-follow-up-products/`,
            data
        );

        return response.data;
    },

    updateFollowUpProduct: async (id, data) => {
        const response = await api.patch(
            `${PATIENTS_URL}/patient-follow-up-products/${id}/`,
            data
        );

        return response.data;
    },

    deleteFollowUpProduct: async (id) => {
        const response = await api.delete(
            `${PATIENTS_URL}/patient-follow-up-products/${id}/`
        );

        return response.data;
    },
};

export default patientService;

export const {
    getPatients,
    getPatient,
    getPatientDetails,
    getFullProfile,
    getMyProfile,
    createPatient,
    updatePatient,
    deletePatient,
    getChronicDiseases,
    createChronicDisease,
    updateChronicDisease,
    deleteChronicDisease,
    getPatientDiseases,
    createPatientDisease,
    updatePatientDisease,
    deletePatientDisease,
    getFitnessProfiles,
    getFitnessProfile,
    updateFitnessProfile,
    deleteFitnessProfile,
    getNutritionProfiles,
    getNutritionProfile,
    updateNutritionProfile,
    deleteNutritionProfile,
    getPregnancyProfiles,
    getPregnancyProfile,
    updatePregnancyProfile,
    deletePregnancyProfile,
    getChildProfiles,
    getChildProfile,
    updateChildProfile,
    deleteChildProfile,
    getMedications,
    getPatientMedications,
    createMedication,
    updateMedication,
    deleteMedication,
    getAdvices,
    createAdvice,
    updateAdvice,
    deleteAdvice,
    getVisits,
    getPatientVisits,
    createVisit,
    updateVisit,
    deleteVisit,
    getFollowUps,
    getFollowUp,
    getPatientFollowUps,
    createFollowUp,
    updateFollowUp,
    deleteFollowUp,
    getFollowUpProducts,
    getFollowUpProductsList,
    createFollowUpProduct,
    updateFollowUpProduct,
    deleteFollowUpProduct,
} = patientService;