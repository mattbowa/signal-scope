import { TagWithContext } from '../types';

interface TagSelectorProps {
  tags: TagWithContext[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
}

/**
 * Component for selecting which sensor tags to display
 */
export function TagSelector({
  tags,
  selectedTagIds,
  onToggleTag,
}: TagSelectorProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Select Sensors
      </h2>
      <div className="space-y-2">
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <label
              key={tag.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleTag(tag.id)}
                className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{tag.label}</div>
                <div className="text-sm text-gray-500">
                  {tag.siteName} • {tag.assetName}
                </div>
                <div className="text-xs text-gray-400">Unit: {tag.unit}</div>
              </div>
            </label>
          );
        })}
      </div>
      {selectedTagIds.length > 0 && (
        <div className="mt-4 p-2 bg-blue-50 rounded text-sm text-blue-800">
          {selectedTagIds.length} sensor{selectedTagIds.length > 1 ? 's' : ''}{' '}
          selected
        </div>
      )}
    </div>
  );
}
