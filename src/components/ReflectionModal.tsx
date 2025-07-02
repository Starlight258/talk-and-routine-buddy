
import React from 'react';
import EnhancedReflectionModal from './EnhancedReflectionModal';

// This is a compatibility wrapper - redirect to the enhanced version
const ReflectionModal = (props) => {
  return <EnhancedReflectionModal {...props} />;
};

export default ReflectionModal;
