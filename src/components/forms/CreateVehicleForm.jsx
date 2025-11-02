// components/CreateVehicleForm.jsx
import React from 'react';
import { useVehicleForm } from '../../hooks/useVehicleForm';

const CreateVehicleForm = ({ onSubmit, onCancel, submitLoading = false }) => {
  const {
    formData,
    errors,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
    setErrors
  } = useVehicleForm({}, false); // false = modo creación

  const vehicleTypes = [
    'Sedan',
    'SUV',
    'PickUp',
  ];

  const handleFeaturesChange = (e) => {
    const value = e.target.value || '';

    setFormData(prev => ({
      ...prev,
      featuresText: value,
      features: value ? value.split(',').map(f => f.trim()).filter(f => f !== '') : []
    }));

    // Limpiar errores si los hay
    if (errors.features) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.features;
        return newErrors;
      });
    }
  };

  const handleImageUrlsChange = (e) => {
    const value = e.target.value || '';

    setFormData(prev => ({
      ...prev,
      imageUrlsText: value,
      imageUrls: value ? value.split(',').map(url => url.trim()).filter(url => url !== '') : []
    }));

    if (errors.imageUrls) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.imageUrls;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Procesar los datos para que coincidan con la estructura esperada por la API
    const processedData = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      vehicleType: formData.vehicleType, // Este es el campo correcto para la API
      capacity: parseInt(formData.capacity),
      pricePerDay: parseFloat(formData.pricePerDay),
      kilometers: parseInt(formData.kilometers),
      kmForMaintenance: parseInt(formData.kmForMaintenance),
      mainImageUrl: formData.mainImageUrl.trim(),
      insurancePhone: formData.insurancePhone ? formData.insurancePhone.trim() : '',
      features: formData.featuresText
        ? formData.featuresText.split(',').map(f => f.trim()).filter(f => f !== '')
        : [],
      imageUrls: formData.imageUrlsText
        ? formData.imageUrlsText.split(',').map(url => url.trim()).filter(url => url !== '')
        : []
    };

    // Validar que todos los campos requeridos estén presentes y sean válidos
    if (!processedData.name || !processedData.brand || !processedData.model ||
      !processedData.vehicleType || isNaN(processedData.capacity) ||
      isNaN(processedData.pricePerDay) || isNaN(processedData.kilometers) ||
      isNaN(processedData.insurancePhone) ||
      isNaN(processedData.kmForMaintenance)) {
      return;
    }

    // console.log('Datos a enviar:', processedData); // Para debug

    try {
      await onSubmit(processedData);
      resetForm();
    } catch (error) {
      // El error se maneja en el componente padre
      // console.error('Error al crear vehículo:', error);
    }
  };

  return (
    <div className=" border-none p-2">

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Nombre del Vehículo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-white/80 bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Toyota Corolla 2023"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Marca *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.brand ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Toyota"
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Modelo *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.model ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: Corolla"
            />
            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Tipo de Vehículo *
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-neutral-800 text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Seleccionar tipo</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type} className="bg-neutral-700 text-white focus:bg-neutral-800 ">
                  {type}
                </option>
              ))}
            </select>
            {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Capacidad (personas) *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              max="50"
              className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: 5"
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Precio por Día ($) *
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pricePerDay ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: 50.00"
            />
            {errors.pricePerDay && <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Kilómetros Actuales *
            </label>
            <input
              type="number"
              name="kilometers"
              value={formData.kilometers}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kilometers ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: 15000"
            />
            {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Kilómetros para Mantenimiento *
            </label>
            <input
              type="number"
              name="kmForMaintenance"
              value={formData.kmForMaintenance}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.kmForMaintenance ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ej: 20000"
            />
            {errors.kmForMaintenance && <p className="text-red-500 text-sm mt-1">{errors.kmForMaintenance}</p>}
          </div>
        </div>

        {/* Características - CORREGIDO */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Características *
          </label>
          <textarea
            name="featuresText"
            value={formData.featuresText || ''}
            onChange={handleFeaturesChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.features ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Ej: Aire acondicionado, Bluetooth, GPS, Cámara trasera (separar con comas)"
          />
          <p className="text-sm text-gray-500 mt-1">Separa las características con comas</p>
          {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}

          {/* Preview de características */}
          {formData.features && formData.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full border border-blue-500/30"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* URLs de imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            URL de Imagen Principal *
          </label>
          <input
            type="url"
            name="mainImageUrl"
            value={formData.mainImageUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mainImageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="https://ejemplo.com/imagen-principal.jpg"
          />
          {errors.mainImageUrl && <p className="text-red-500 text-sm mt-1">{errors.mainImageUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            URLs de Imágenes Adicionales
          </label>
          <textarea
            name="imageUrlsText"
            value={formData.imageUrlsText}
            onChange={handleImageUrlsChange}
            rows="2"
            className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.imageUrls ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg (separar con comas)"
          />
          <p className="text-sm text-gray-500 mt-1">Separa las URLs con comas</p>
          {errors.imageUrls && <p className="text-red-500 text-sm mt-1">{errors.imageUrls}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Número telefónico de la aseguradora *
          </label>
          <input
            type="phone"
            name="insurancePhone"
            value={formData.insurancePhone}
            onChange={handleChange}
            min="1"
            max="50"
            className={`w-full px-3 py-2 border rounded-md text-white/80 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.insurancePhone ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Ej: 5"
          />
          {errors.insurancePhone && <p className="text-red-500 text-sm mt-1">{errors.insurancePhone}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-200 hover:bg-gray-50 hover:text-gray-700"
            disabled={submitLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading ? 'Creando...' : 'Crear Vehículo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVehicleForm;