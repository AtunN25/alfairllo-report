// components/PDFGenerator.tsx
import { PDFDownloadLink, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import test from '../../../public/test.png'

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        border: '2px solid #000', // Marco en la hoja
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    table: {
        width: '100%',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
        padding: 5,
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    tableCell: {
        flex: 1,
        fontSize: 12,
        padding: 5,
    },
    image: {
        width: 100,
        height: 50,
        position: 'absolute',
        top: 30,
        right: 30,
    },
});



// Componente del PDF
const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Imagen en la parte superior derecha */}
            <Image
                src={test} // Ruta de la imagen
                style={styles.image}
            />

            {/* Título centrado */}
            <Text style={styles.title}>Reporte diario de actividades</Text>
            <Text style={styles.subtitle}>Noviembre 11/2024</Text>

            {/* Tabla de Safety Talk */}
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>Safety Talk</Text>
                    <Text style={styles.tableCell}>Detalles</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Título</Text>
                    <Text style={styles.tableCell}>Charla de 5 minutos</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Speaker</Text>
                    <Text style={styles.tableCell}>Supervisor Hugo Macaya</Text>
                </View>
            </View>

            {/* Tabla de Trabajos Realizados */}
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>Trabajos Realizados</Text>
                    <Text style={styles.tableCell}>Detalles</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Validación de sondajes</Text>
                    <Text style={styles.tableCell}>En proceso de perforación</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Traslado de cajas</Text>
                    <Text style={styles.tableCell}>A sala de corte</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Ingreso de información</Text>
                    <Text style={styles.tableCell}>A base de datos</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>Envío de muestras</Text>
                    <Text style={styles.tableCell}>Al laboratorio</Text>
                </View>
            </View>

            {/* Pie de página */}
            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 20 }}>
                Hugo Macaya Cayo - Supervisor de muestrera - Proyecto El Zorro (2024) - hugo.macaya@tesorogold.com.au
            </Text>
        </Page>
    </Document>
);

function PDFGenerator() {
    return (
        <PDFDownloadLink document={<MyDocument />} fileName="reporte.pdf">
        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
      </PDFDownloadLink>
    )
}

export default PDFGenerator
