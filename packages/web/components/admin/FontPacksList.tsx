'use client';

import { useState } from 'react';
import { FontPackMeta, PackStatus } from '../../lib/admin/font-packs';
import FontPackItem from './FontPackItem';
import CreateFontPackModal from './CreateFontPackModal';

export default function FontPacksList({
  initialPacks,
}: {
  initialPacks: FontPackMeta[];
}) {
  const [packs] = useState<FontPackMeta[]>(initialPacks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PackStatus | 'all'>(
    'all'
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const statuses: Array<PackStatus | 'all'> = [
    'all',
    'active',
    'draft',
    'pending_review',
    'rejected',
  ];

  const filteredPacks = packs.filter((pack) => {
    const matchesStatus =
      selectedStatus === 'all' || pack.status === selectedStatus;
    const matchesSearch =
      searchQuery === '' ||
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  const handlePackCreated = () => {
    setIsCreateModalOpen(false);
    window.location.reload();
  };

  const handlePackUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search packs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          ➕ Create Pack
        </button>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedStatus === status
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({packs.filter((p) => p.status === status).length})
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Packs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No packs found</p>
          </div>
        ) : (
          filteredPacks.map((pack) => (
            <FontPackItem
              key={pack.id}
              pack={pack}
              onUpdate={handlePackUpdate}
            />
          ))
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredPacks.length} of {packs.length} packs
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateFontPackModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handlePackCreated}
        />
      )}
    </div>
  );
}
