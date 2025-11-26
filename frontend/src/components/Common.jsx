 const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600';
      case 'STAFF': return 'bg-yellow-500';
      case 'USER': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };
  export default getRoleBadgeColor