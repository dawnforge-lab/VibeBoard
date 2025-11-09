'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FontPackMeta,
  deleteFontPack,
  toggleFeatured,
  approvePack,
  rejectPack,
} from '../../lib/admin/font-packs';
import EditFontPackModal from './EditFontPackModal';

export default function FontPackItem({
  pack,
  onUpdate,
}: {
  pack: FontPackMeta;
  onUpdate: () => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this pack?')) {
      return;
    }

    const success = await deleteFontPack(pack.id);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to delete pack');
    }
  };

  const handleToggleFeatured = async () => {
    setIsUpdating(true);
    const success = await toggleFeatured(pack.id, !pack.is_featured);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to update featured status');
    }
    setIsUpdating(false);
  };

  const handleApprove = async () => {
    setIsUpdating(true);
    const success = await approvePack(pack.id);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to approve pack');
    }
    setIsUpdating(false);
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this pack?')) {
      return;
    }

    setIsUpdating(true);
    const success = await rejectPack(pack.id);
    if (success) {
      onUpdate();
    } else {
      alert('Failed to reject pack');
    }
    setIsUpdating(false);
  };

  const statusColors: Record<string, string> = {
    active:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    pending_review:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  const statusColor = statusColors[pack.status] || statusColors.draft;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative">
          {pack.thumbnail_url ? (
            <Image
              src={pack.thumbnail_url}
              alt={pack.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pack.name}
            </h3>
            {pack.is_featured && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                ⭐ Featured
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {pack.description}
          </p>

          <div className="flex items-center space-x-2 mb-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${statusColor}`}
            >
              {pack.status.replace('_', ' ')}
            </span>
            {pack.is_free ? (
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                Free
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ${pack.price_usd.toFixed(2)}
              </span>
            )}
          </div>

          {pack.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {pack.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
              {pack.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{pack.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span>⬇️ {pack.downloads_count.toLocaleString()}</span>
            {!pack.is_free && <span>💰 ${pack.revenue_total.toFixed(2)}</span>}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleToggleFeatured}
                disabled={isUpdating}
                className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                  pack.is_featured
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {pack.is_featured ? 'Unfeature' : 'Feature'}
              </button>
            </div>

            {pack.status === 'pending_review' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleApprove}
                  disabled={isUpdating}
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={isUpdating}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  ✕ Reject
                </button>
              </div>
            )}

            <button
              onClick={handleDelete}
              className="w-full px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditFontPackModal
          pack={pack}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}
