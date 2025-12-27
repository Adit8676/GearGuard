import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../../store/requestStore';
import usePageTitle from '../../hooks/usePageTitle';

const NewRequest = () => {
  usePageTitle('New Request - GearGuard');
  const navigate = useNavigate();
  const { createRequest, fetchEquipment, equipment, getEquipmentById, loading } = useRequestStore();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipmentId: '',
    priority: 'medium',
    type: 'corrective'
  });
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEquipmentChange = (e) => {
    const equipmentId = e.target.value;
    setFormData(prev => ({ ...prev, equipmentId }));
    
    if (equipmentId) {
      const equipment = getEquipmentById(equipmentId);
      setSelectedEquipment(equipment);
    } else {
      setSelectedEquipment(null);
    }
    
    if (errors.equipmentId) {
      setErrors(prev => ({ ...prev, equipmentId: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.equipmentId) newErrors.equipmentId = 'Equipment selection is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    try {
      const requestData = {
        ...formData,
        equipmentName: selectedEquipment?.name,
        teamId: selectedEquipment?.teamId,
        teamName: selectedEquipment?.teamName
      };
      
      await createRequest(requestData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Maintenance Request</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.subject ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Brief description of the issue"
              />
              {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Detailed description of the maintenance issue..."
              />
            </div>

            {/* Equipment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Equipment *
              </label>
              <select
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleEquipmentChange}
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.equipmentId ? 'border-red-500' : 'border-slate-600'
                }`}
              >
                <option value="">Select Equipment</option>
                {equipment.map(eq => (
                  <option key={eq._id} value={eq._id}>{eq.name}</option>
                ))}
              </select>
              {errors.equipmentId && <p className="text-red-400 text-sm mt-1">{errors.equipmentId}</p>}
            </div>

            {/* Auto-filled Team - Hidden */}

            {/* Priority and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="corrective">Corrective</option>
                  <option value="preventive">Preventive</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/user/dashboard')}
                className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;