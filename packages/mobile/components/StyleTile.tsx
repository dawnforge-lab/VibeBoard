import { View, Text, TouchableOpacity, Alert, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useAppStore, type StyledResult } from '../store/appStore';

interface StyleTileProps {
  style: StyledResult;
}

export default function StyleTile({ style }: StyleTileProps) {
  const favorites = useAppStore((state) => state.favorites);
  const addFavorite = useAppStore((state) => state.addFavorite);
  const removeFavorite = useAppStore((state) => state.removeFavorite);

  const isFavorite = favorites.includes(style.id);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(style.styled);
      Alert.alert('Copied!', 'Text copied to clipboard', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy text');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: style.styled,
        title: `VibeBoard - ${style.name}`,
      });
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.message) {
        Alert.alert('Error', 'Failed to share text');
      }
    }
  };

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavorite(style.id);
    } else {
      addFavorite(style.id);
    }
  };

  return (
    <View className="bg-gray-900 rounded-lg p-4 mb-3">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-400 text-sm font-semibold">
          {style.name}
        </Text>
        <TouchableOpacity onPress={handleFavorite} className="p-1">
          <Text className="text-xl">{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Styled Text */}
      <View className="bg-gray-800 rounded-lg p-4 mb-3">
        <Text className="text-white text-lg" numberOfLines={3} selectable>
          {style.styled}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 bg-blue-600 rounded-lg py-3 px-4 flex-row justify-center items-center"
          onPress={handleCopy}
        >
          <Text className="text-white font-semibold mr-2">Copy</Text>
          <Text>📋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-purple-600 rounded-lg py-3 px-4 flex-row justify-center items-center"
          onPress={handleShare}
        >
          <Text>📤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
