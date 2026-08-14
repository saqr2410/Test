import api from "../../api/axios";

/* ==========================================================
   Patients
========================================================== */

export const getPatients = async () => {
    const { data } = await api.get("/patients/");
    return data;
};

export const getPatientDetails = async (id) => {
    const { data } = await api.get(`/patients/${id}/`);
    return data;
};

export const createPatient = async (payload) => {
    const { data } = await api.post("/patients/", payload);
    return data;
};

export const updatePatient = async (id, payload) => {
    const { data } = await api.patch(`/patients/${id}/`, payload);
    return data;
};

export const deletePatient = async (id) => {
    const { data } = await api.delete(`/patients/${id}/`);
    return data;
};


/* ==========================================================
   Chronic Diseases
========================================================== */

export const getChronicDiseases = async () => {
    const { data } = await api.get("/chronic-diseases/");
    return data;
};


/* ==========================================================
   Patient Diseases
========================================================== */

export const getPatientDiseases = async (patientId) => {
    const { data } = await api.get(
        `/patient-diseases/?patient=${patientId}`
    );
    return data;
};

export const addPatientDisease = async (payload) => {
    const { data } = await api.post(
        "/patient-diseases/",
        payload
    );
    return data;
};

export const updatePatientDisease = async (id, payload) => {
    const { data } = await api.patch(
        `/patient-diseases/${id}/`,
        payload
    );
    return data;
};

export const deletePatientDisease = async (id) => {
    const { data } = await api.delete(
        `/patient-diseases/${id}/`
    );
    return data;
};


/* ==========================================================
   Patient Medications
========================================================== */

export const getPatientMedications = async (patientId) => {
    const { data } = await api.get(
        `/medications/patient/${patientId}/`
    );
    return data;
};

export const createPatientMedication = async (payload) => {
    const { data } = await api.post(
        "/medications/",
        payload
    );
    return data;
};

export const updatePatientMedication = async (id, payload) => {
    const { data } = await api.patch(
        `/medications/${id}/`,
        payload
    );
    return data;
};

export const deletePatientMedication = async (id) => {
    const { data } = await api.delete(
        `/medications/${id}/`
    );
    return data;
};


/* ==========================================================
   Patient Visits
========================================================== */

export const getPatientVisits = async (patientId) => {
    const { data } = await api.get(
        `/visits/patient/${patientId}/`
    );
    return data;
};

export const createPatientVisit = async (payload) => {
    const { data } = await api.post(
        "/visits/",
        payload
    );
    return data;
};

export const updatePatientVisit = async (id, payload) => {
    const { data } = await api.patch(
        `/visits/${id}/`,
        payload
    );
    return data;
};

export const deletePatientVisit = async (id) => {
    const { data } = await api.delete(
        `/visits/${id}/`
    );
    return data;
};