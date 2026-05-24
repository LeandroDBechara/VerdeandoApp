import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useUser } from "@/contexts/UserContext";
import TablaRanking from "@/components/TablaRanking";
import { datos, useLeaderBoards } from "@/contexts/LeaderboardsContext";
import { getResiduoIcon } from "@/contexts/IntercambiosContext";
import TablaMaterial from "@/components/TablaMaterial";

type LeaderboardSectionProps = {
  title: string;
  icon: "recycle" | "star" | "calendar-days" | "leaf";
  children: React.ReactNode;
};

function LeaderboardSection({ title, icon, children }: LeaderboardSectionProps) {
  return (
    <View style={styles.leaderboardCard}>
      <LinearGradient
        colors={["#2C7865", "#1E5248"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.leaderboardCardHeader}
      >
        <View style={styles.leaderboardCardHeaderIcon}>
          <FontAwesome6 name={icon} size={16} color="#FFD700" />
        </View>
        <Text style={styles.leaderboardCardTitle}>{title}</Text>
      </LinearGradient>
      <View style={styles.leaderboardCardBody}>{children}</View>
    </View>
  );
}

export default function Leaderboards() {
  const { user } = useUser();
  const {
    getUsuariosConMasPuntos,
    getUsuariosQueMasReciclaron,
    getTuMaterialMasReciclado,
    getUsuariosQueMasEventosParticiparon,
  } = useLeaderBoards();
  const [usuariosConMasPuntos, setUsuariosConMasPuntos] = useState<datos[]>([]);
  const [usuariosQueMasReciclaron, setUsuariosQueMasReciclaron] = useState<datos[]>([]);
  const [usuariosQueMasEventosParticiparon, setUsuariosQueMasEventosParticiparon] = useState<datos[]>([]);
  const [tuMaterialMasReciclado, setTuMaterialMasReciclado] = useState<datos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const materiaIcon = tuMaterialMasReciclado.map((item) => ({
    nombre: item.nombre,
    valor: item.valor,
    icono: getResiduoIcon(item.nombre),
  }));

  const displayName = [user?.nombre, user?.apellido].filter(Boolean).join(" ") || "Reciclaneito";

  useEffect(() => {
    let isMounted = true;

    const cargarLeaderboards = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [puntos, reciclaje, eventos, material] = await Promise.all([
          getUsuariosConMasPuntos(),
          getUsuariosQueMasReciclaron(),
          getUsuariosQueMasEventosParticiparon(),
          getTuMaterialMasReciclado(user?.id ?? ""),
        ]);

        if (!isMounted) {
          return;
        }

        setUsuariosConMasPuntos(Array.isArray(puntos) ? puntos : []);
        setUsuariosQueMasReciclaron(Array.isArray(reciclaje) ? reciclaje : []);
        setUsuariosQueMasEventosParticiparon(Array.isArray(eventos) ? eventos : []);
        setTuMaterialMasReciclado(Array.isArray(material) ? material : []);
      } catch {
        if (isMounted) {
          setError("No pudimos cargar el ranking en este momento.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    cargarLeaderboards();

    return () => {
      isMounted = false;
    };
  }, [
    getTuMaterialMasReciclado,
    getUsuariosConMasPuntos,
    getUsuariosQueMasEventosParticiparon,
    getUsuariosQueMasReciclaron,
    user?.id,
  ]);

  const noHayDatos = useMemo(() => {
    return (
      usuariosConMasPuntos.length === 0
      && usuariosQueMasReciclaron.length === 0
      && usuariosQueMasEventosParticiparon.length === 0
      && tuMaterialMasReciclado.length === 0
    );
  }, [
    tuMaterialMasReciclado,
    usuariosConMasPuntos.length,
    usuariosQueMasEventosParticiparon.length,
    usuariosQueMasReciclaron.length,
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={["#1E5248", "#2C7865", "#3D9A82"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.trophyGlow}>
          <FontAwesome6 name="trophy" size={52} color="#FFD700" />
        </View>
        <Text style={styles.title}>Ranking</Text>
        <Text style={styles.subtitle}>Compite con la comunidad y entra en el Top 10 de Verdeando!</Text>
      </LinearGradient>

      <LinearGradient
        colors={["#1E5248", "#2C7865"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.playerCard}
      >
        <Text style={styles.playerLabel}>Tu perfil</Text>
        <Text style={styles.playerName}>{displayName}</Text>
        <View style={styles.playerStatsRow}>
          <View style={styles.playerStat}>
            <Text style={styles.playerStatValue}>{user?.puntos ?? 0}</Text>
            <Text style={styles.playerStatLabel}>Puntos</Text>
          </View>
        </View>
        <Text style={styles.hint}>Subi en el ranking reciclando y participando en eventos.</Text>
      </LinearGradient>

      {isLoading && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#2C7865" />
          <Text style={styles.statusText}>Cargando ranking...</Text>
        </View>
      )}

      {!isLoading && error && (
        <View style={styles.statusCard}>
          <FontAwesome6 name="circle-exclamation" size={24} color="#B3261E" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && !error && noHayDatos && (
        <View style={styles.statusCard}>
          <FontAwesome6 name="ranking-star" size={28} color="#2C7865" />
          <Text style={styles.statusText}>Todavia no hay datos de ranking para mostrar.</Text>
        </View>
      )}

      {!isLoading && !error && !noHayDatos && (
        <>
          {tuMaterialMasReciclado.length > 0 && (
            <LeaderboardSection title="Tu material mas reciclado" icon="leaf">
              <TablaMaterial datos={materiaIcon} unidad="g" />
            </LeaderboardSection>
          )}

          {usuariosConMasPuntos.length > 0 && (
            <LeaderboardSection title="Usuarios con mas puntos" icon="star">
              <TablaRanking datos={usuariosConMasPuntos} unidad="pts" />
            </LeaderboardSection>
          )}

          {usuariosQueMasReciclaron.length > 0 && (
            <LeaderboardSection title="Usuarios que mas reciclaron" icon="recycle">
              <TablaRanking datos={usuariosQueMasReciclaron} unidad="g" scoreLabel="Cantidad" />
            </LeaderboardSection>
          )}

          {usuariosQueMasEventosParticiparon.length > 0 && (
            <LeaderboardSection title="Usuarios con mayor participación en eventos" icon="calendar-days">
              <TablaRanking
                datos={usuariosQueMasEventosParticiparon}
                unidad="eventos"
                scoreLabel="Cantidad"
              />
            </LeaderboardSection>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF6F3",
  },
  content: {
    paddingBottom: 80,
  },
  heroBanner: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 16,
  },
  trophyGlow: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.4)",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    textAlign: "center",
  },
  playerCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.35)",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  playerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  playerStatsRow: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  playerStat: {
    alignItems: "center",
  },
  playerStatValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFD700",
  },
  playerStatLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  hint: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 18,
  },
  leaderboardCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#1E5248",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#D4E8E0",
  },
  leaderboardCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  leaderboardCardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  leaderboardCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
    flex: 1,
  },
  leaderboardCardBody: {
    padding: 12,
    backgroundColor: "#FAFFFE",
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D4E8E0",
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 15,
    color: "#B3261E",
    textAlign: "center",
  },
});
