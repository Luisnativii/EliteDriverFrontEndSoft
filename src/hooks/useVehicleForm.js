import { useState, useCallback } from 'react';

export const useVehicleForm = (initialData = {}, isEditMode = false) => {
  // Initialize with default values to prevent controlled/uncontrolled input issues
  const getInitialFormData = () => ({
    // Basic fields - always defined with defaults
    name: initialData.name || '',
    brand: initialData.brand || '',
    model: initialData.model || '',
    capacity: initialData.capacity?.toString() || '',
    vehicleType: initialData.vehicleType || initialData.type || '', // Handle both field names
    pricePerDay: initialData.pricePerDay?.toString() || '',
    kilometers: initialData.kilometers?.toString() || '',
    kilometersDisplay: initialData.kilometers
  ? initialData.kilometers.toLocaleString()
  : '',
    kmForMaintenance: initialData.kmForMaintenance?.toString() || '',
    mainImageUrl: initialData.mainImageUrl || '',
    insurancePhone: initialData.insurancePhone || '',

    // Complex fields with proper handling
    features: Array.isArray(initialData.features) ? initialData.features : [],
    featuresText: (() => {
      if (Array.isArray(initialData.features)) {
        return initialData.features.join(', ');
      } else if (typeof initialData.features === 'string') {
        return initialData.features;
      }
      return '';
    })(),

    imageUrls: Array.isArray(initialData.imageUrls) ? initialData.imageUrls : [],
    imageUrlsText: (() => {
      if (Array.isArray(initialData.imageUrls)) {
        return initialData.imageUrls.join(', ');
      } else if (typeof initialData.imageUrls === 'string') {
        return initialData.imageUrls;
      }
      return '';
    })(),

    // Other fields
    image: null,
    status: initialData.status || 'maintenanceCompleted'
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Formateo especial para campos numéricos
    if (name === 'capacity' || name === 'kilometers' || name === 'kmForMaintenance') {
      const numericValue = value.replace(/\D/g, '');

      // Validación especial para kilómetros en modo edición
      if (name === 'kilometers' && isEditMode && initialData.kilometers) {
        const newKilometers = parseInt(numericValue);
        const originalKilometers = parseInt(initialData.kilometers);

        if (numericValue && newKilometers < originalKilometers) {
          setErrors(prev => ({
            ...prev,
            kilometers: `Los kilómetros no pueden ser menores a ${originalKilometers}`
          }));
          return;
        }
      }

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
    // Formateo especial para precio
    else if (name === 'pricePerDay') {
      const numericValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value || '' // Ensure value is never undefined
      }));
    }

    // Limpiar error específico cuando el usuario empieza a escribir
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, [isEditMode, initialData.kilometers]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // En modo edición, solo validar campos editables
    if (isEditMode) {
      if (!formData.pricePerDay) {
        newErrors.pricePerDay = 'El precio por día es requerido';
      } else if (parseFloat(formData.pricePerDay) <= 0) {
        newErrors.pricePerDay = 'El precio debe ser mayor a 0';
      }
      if (!formData.insurancePhone.trim()) {
        newErrors.insurancePhone = 'El teléfono de la aseguradora es requerido';
      }


      if (!formData.kilometers) {
        newErrors.kilometers = 'Los kilómetros son requeridos';
      } else if (parseInt(formData.kilometers) < 0) {
        newErrors.kilometers = 'Los kilómetros no pueden ser negativos';
      } else if (initialData.kilometers && parseInt(formData.kilometers) < parseInt(initialData.kilometers)) {
        newErrors.kilometers = `Los kilómetros no pueden ser menores a ${initialData.kilometers}`;
      }

      if (!formData.kmForMaintenance) {
        newErrors.kmForMaintenance = 'Los kilómetros para mantenimiento son requeridos';
      }
    } else {
      // Validaciones completas para creación
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre del vehículo es requerido';
      }

      if (!formData.brand.trim()) {
        newErrors.brand = 'La marca es requerida';
      }

      if (!formData.model.trim()) {
        newErrors.model = 'El modelo es requerido';
      }

      if (!formData.capacity) {
        newErrors.capacity = 'La capacidad es requerida';
      } else if (parseInt(formData.capacity) < 1 || parseInt(formData.capacity) > 50) {
        newErrors.capacity = 'La capacidad debe estar entre 1 y 50 personas';
      }

      if (!formData.vehicleType) {
        newErrors.vehicleType = 'El tipo de vehículo es requerido';
      }

      if (!formData.pricePerDay) {
        newErrors.pricePerDay = 'El precio por día es requerido';
      } else if (parseFloat(formData.pricePerDay) <= 0) {
        newErrors.pricePerDay = 'El precio debe ser mayor a 0';
      }

      if (!formData.kilometers) {
        newErrors.kilometers = 'Los kilómetros son requeridos';
      } else if (parseInt(formData.kilometers) < 0) {
        newErrors.kilometers = 'Los kilómetros no pueden ser negativos';
      }

      if (!formData.kmForMaintenance) {
        newErrors.kmForMaintenance = 'Los kilómetros para mantenimiento son requeridos';
      }

      if (!formData.featuresText.trim()) {
        newErrors.features = 'Las características son requeridas';
      }

      if (!formData.mainImageUrl.trim()) {
        newErrors.mainImageUrl = 'La URL de la imagen principal es requerida';
      } else if (!isValidUrl(formData.mainImageUrl)) {
        newErrors.mainImageUrl = 'La URL de la imagen principal no es válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isEditMode, initialData.kilometers]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, [initialData]);

  // Helper function to prepare data for submission
  const getSubmissionData = useCallback(() => {
    const submissionData = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      type: formData.vehicleType, // Map vehicleType to type for API
      capacity: parseInt(formData.capacity),
      pricePerDay: parseFloat(formData.pricePerDay),
      kilometers: parseInt(formData.kilometers),
      kmForMaintenance: parseInt(formData.kmForMaintenance),
      mainImageUrl: formData.mainImageUrl.trim(),
      status: formData.status || 'maintenanceCompleted',

      // Process features from text
      features: formData.featuresText
        ? formData.featuresText.split(',').map(f => f.trim()).filter(f => f !== '')
        : [],

      // Process image URLs from text
      imageUrls: formData.imageUrlsText
        ? formData.imageUrlsText.split(',').map(url => url.trim()).filter(url => url !== '')
        : []
    };

    // Remove empty or invalid fields
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key] === '' || submissionData[key] === null ||
        (Array.isArray(submissionData[key]) && submissionData[key].length === 0 && key !== 'features')) {
        delete submissionData[key];
      }
    });

    return submissionData;
  }, [formData]);

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setErrors,
    setIsLoading,
    getSubmissionData // New helper function
  };
};