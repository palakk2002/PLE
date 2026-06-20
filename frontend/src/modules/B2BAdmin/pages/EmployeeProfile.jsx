import React from 'react';
import { useParams } from 'react-router-dom';

const EmployeeProfile = () => {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-gray-600">Details for employee {id} will go here.</p>
      </div>
    </div>
  );
};

export default EmployeeProfile;
