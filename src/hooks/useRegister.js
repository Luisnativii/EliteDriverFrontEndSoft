// hooks/useRegister.js
import { useState } from 'react';
import { register } from '../services/authService';

export const useRegister = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        dui: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Formateo especial para DUI (solo números, máximo 9)
        if (name === 'dui') {
            const numericValue = value.replace(/\D/g, '').slice(0, 9);
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        }
        // Formateo especial para número de teléfono (solo números, máximo 8)
        else if (name === 'phoneNumber') {
            const numericValue = value.replace(/\D/g, '').slice(0, 8);
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Limpiar error específico cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación de nombre
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
        }

        // Validación de apellido
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
        }

        // Validación de fecha de nacimiento
        if (!formData.birthDate) {
            newErrors.birthDate = 'La fecha de nacimiento es requerida';
        } else {
            const today = new Date();
            const birthDate = new Date(formData.birthDate);

            // Calcular edad correctamente considerando mes y día
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                newErrors.birthDate = 'Debes ser mayor de 18 años';
            } else if (age > 100) {
                newErrors.birthDate = 'Por favor verifica la fecha de nacimiento';
            }
        }

        // Validación de DUI
        if (!formData.dui) {
            newErrors.dui = 'El DUI es requerido';
        } else if (formData.dui.length !== 9) {
            newErrors.dui = 'El DUI debe tener 9 dígitos';
        }

        // Teléfono (8 dígitos y debe iniciar con 6 o 7)
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'El número de teléfono es requerido';
        } else if (formData.phoneNumber.length !== 8) {
            newErrors.phoneNumber = 'El número de teléfono debe tener 8 dígitos';
        } else if (!/^[67]/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'El número de teléfono debe iniciar con 6 o 7';
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        // Validación de contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validación de confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'La confirmación de contraseña es requerida';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Función para formatear datos antes de enviar a la API
    const formatDataForAPI = (data) => {
        return {
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            birthDate: data.birthDate,
            // Formatear DUI correctamente para la API
            dui: data.dui.length === 9 ? `${data.dui.slice(0, 8)}-${data.dui.slice(8)}` : data.dui,
            // Formatear teléfono correctamente para la API  
            phoneNumber: data.phoneNumber.length === 8 ?
                `${data.phoneNumber.slice(0, 4)}-${data.phoneNumber.slice(4)}` :
                data.phoneNumber,
            email: data.email.trim().toLowerCase(),
            password: data.password,
            confirmPassword: data.confirmPassword
        };
    };

    const handleSubmit = async (e, onSuccess) => {
        e.preventDefault();

        // Limpiar errores previos
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Formatear datos para la API
            const formattedData = formatDataForAPI(formData);
            // console.log('Datos formateados para API:', formattedData);

            // Llamar al servicio de registro
            const response = await register(formattedData);
            // console.log('Registro exitoso:', response);

            // Reset form después del éxito
            setFormData({
                firstName: '',
                lastName: '',
                birthDate: '',
                dui: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

            // Ejecutar callback de éxito si se proporciona
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(response);
            }

        } catch (error) {
            // console.error('Error en el registro:', error);

            // Manejar errores específicos
            if (error.message) {
                setErrors({ submit: error.message });
            } else {
                setErrors({ submit: 'Error al procesar el registro. Intenta nuevamente.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            birthDate: '',
            dui: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        isLoading,
        handleChange,
        handleSubmit,
        resetForm,
        validateForm,
        formatDataForAPI,
        setErrors
    };
};