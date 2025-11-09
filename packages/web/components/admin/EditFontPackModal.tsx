'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FontPackMeta,
  updateFontPack,
  PackStatus,
  uploadPackFile,
  uploadThumbnail,
} from '../../lib/admin/font-packs';

export default function EditFontPackModal({
  pack,
  onClose,
  onSuccess,
}: {
  pack: FontPackMeta;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(pack.name);
  const [description, setDescription] = useState(pack.description);
  const [priceUsd, setPriceUsd] = useState(pack.price_usd);
  const [isFree, setIsFree] = useState(pack.is_free);
  const [isFeatured, setIsFeatured] = useState(pack.is_featured);
  const [tags, setTags] = useState(pack.tags.join(', '));
  const [status, setStatus] = useState<PackStatus>(pack.status);
  const [packFile, setPackFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses: PackStatus[] = [
    'active',
    'draft',
    'pending_review',
    'rejected',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let storageUrl: string | undefined = undefined;
      let thumbnailUrl: string | undefined = undefined;

      // Upload new pack file if provided
      if (packFile) {
        const url = await uploadPackFile(pack.pack_id, packFile);
        if (url) storageUrl = url;
      }

      // Upload new thumbnail if provided
      if (thumbnailFile) {
        const url = await uploadThumbnail(pack.pack_id, thumbnailFile);
        if (url) thumbnailUrl = url;
      }

      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const success = await updateFontPack(pack.id, {
        name,
        description,
        price_usd: isFree ? 0 : priceUsd,
        is_free: isFree,
        is_featured: isFeatured,
        tags: tagsArray,
        status,
        ...(storageUrl && { storage_url: storageUrl }),
        ...(thumbnailUrl && { thumbnail_url: thumbnailUrl }),
      });

      if (success) {
        onSuccess();
      } else {
        alert('Failed to update font pack');
      }
    } catch (error) {
      console.error('Error updating font pack:', error);
      alert('Failed to update font pack');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Font Pack
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pack.pack_id}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Free Pack
                </span>
              </label>
            </div>

            {!isFree && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PackStatus)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Feature this pack on homepage
              </span>
            </label>
          </div>

          {/* Pack JSON File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Replace Pack JSON File (optional)
            </label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setPackFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {pack.storage_url && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current: {pack.storage_url}
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Replace Thumbnail Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {pack.thumbnail_url && (
              <div className="mt-2">
                <Image
                  src={pack.thumbnail_url}
                  alt="Current thumbnail"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Pack Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Downloads:
                </span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {pack.downloads_count.toLocaleString()}
                </span>
              </div>
              {!pack.is_free && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Revenue:
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    ${pack.revenue_total.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
