import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

interface PlayerAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  color?: string;
  borderColor?: string;
}

const AVATAR_COLORS = [
  Colors.primary,
  Colors.teal,
  Colors.blue,
  Colors.purple,
  Colors.amber,
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function PlayerAvatar({
  name,
  avatarUrl,
  size = 36,
  color,
  borderColor = "transparent",
}: PlayerAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const bg = color ?? getAvatarColor(name);
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor,
        },
      ]}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1.5,
  },
  initials: {
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
});
