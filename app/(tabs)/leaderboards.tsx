import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { useUser } from "@/contexts/UserContext";
import TablaRanking from "@/components/TablaRanking";
import { datos, useLeaderBoards } from "@/contexts/LeaderboardsContext";
import { getResiduoIcon } from "@/contexts/IntercambiosContext";
import TablaMaterial from "@/components/TablaMaterial";



export default function Leaderboards() {
  const { user } = useUser();
  const { getUsuariosConMasPuntos, getUsuariosQueMasReciclaron, getTuMaterialMasReciclado, getUsuariosQueMasEventosParticiparon, } = useLeaderBoards();
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
      <View style={styles.header}>
        <FontAwesome6 name="trophy" size={48} color="#2C7865" />
        <Text style={styles.title}>Ranking</Text>
        <Text style={styles.subtitle}>Ranking de reciclaneitos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu progreso</Text>
        <Text style={styles.points}>{user?.puntos ?? 0} puntos</Text>
        <Text style={styles.hint}>Mira como venis frente a la comunidad.</Text>
      </View>

      {isLoading && (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#2C7865" />
          <Text style={styles.statusText}>Cargando ranking...</Text>
        </View>
      )}

      {!isLoading && error && (
        <View style={styles.statusCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isLoading && !error && noHayDatos && (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Todavia no hay datos de ranking para mostrar.</Text>
        </View>
      )}

      {!isLoading && !error && !noHayDatos && (
        <>
          {tuMaterialMasReciclado.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tu material mas reciclado</Text>
              <TablaMaterial datos={materiaIcon} unidad="g" />
            </View>
          )}

          {usuariosConMasPuntos.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Usuarios con mas puntos</Text>
              <TablaRanking datos={usuariosConMasPuntos} unidad="pts" />
            </View>
          )}

          {usuariosQueMasReciclaron.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Usuarios que mas reciclaron</Text>
              <TablaRanking datos={usuariosQueMasReciclaron} unidad="g" />
            </View>
          )}

          {usuariosQueMasEventosParticiparon.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Usuarios con mas eventos</Text>
              <TablaRanking datos={usuariosQueMasEventosParticiparon} unidad="eventos" />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C7865",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  points: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    gap: 8,
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
  materialName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C7865",
    marginBottom: 4,
  },
  materialValue: {
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
  },
});
