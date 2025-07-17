import React, { useState } from 'react';
import styles from './RoleList.module.css';

interface Role {
  name: string;
  team: 'good' | 'evil';
  description: string;
  selected?: boolean;
}

interface RoleListProps {
  roles: Role[];
  allowSelect?: boolean;
}

const RoleList: React.FC<RoleListProps> = ({ roles, allowSelect = false }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const showRoleInfo = (role: Role) => {
    setSelectedRole(role);
    setShowDialog(true);
  };

  const handleCheckboxChange = (index: number) => {
    if (allowSelect && roles[index]) {
      roles[index].selected = !roles[index].selected;
    }
  };

  return (
    <div>
      <div className={styles.roleList}>
        {roles.map((role, index) => (
          <div key={index} className={styles.roleItem}>
            {allowSelect && (
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={role.selected || false}
                  onChange={() => handleCheckboxChange(index)}
                  className={styles.checkbox}
                />
              </div>
            )}
            <div className={styles.roleContent}>
              <span className={`${styles.icon} ${role.team === 'evil' ? styles.iconEvil : ''}`}>
                {role.team === 'good' ? '🏛️' : '⚔️'}
              </span>
              <span className={styles.roleName}>{role.name}</span>
            </div>
            <button 
              className={styles.infoButton}
              onClick={() => showRoleInfo(role)}
              aria-label={`Show info for ${role.name}`}
            >
              ℹ️
            </button>
          </div>
        ))}
      </div>

      {showDialog && selectedRole && (
        <div className={styles.dialogBackdrop} onClick={() => setShowDialog(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <span className={`${styles.dialogIcon} ${selectedRole.team === 'evil' ? styles.iconEvil : ''}`}>
                {selectedRole.team === 'good' ? '🏛️' : '⚔️'}
              </span>
              <h3>{selectedRole.name}</h3>
            </div>
            <div className={styles.dialogContent}>
              {selectedRole.description}
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setShowDialog(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleList;