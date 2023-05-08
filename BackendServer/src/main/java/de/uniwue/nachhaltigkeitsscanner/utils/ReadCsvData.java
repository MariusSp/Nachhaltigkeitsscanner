package de.uniwue.nachhaltigkeitsscanner.utils;

import de.uniwue.nachhaltigkeitsscanner.entities.Company;
import de.uniwue.nachhaltigkeitsscanner.entities.Report;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Persistence;
import java.io.File;
import java.io.FileNotFoundException;
import java.time.Year;
import java.util.*;

public class ReadCsvData {
    private static final Logger logger = LoggerFactory.getLogger(ReadCsvData.class);

    private static Session session;

    public static void main(String[] args) throws FileNotFoundException {
//        String basePath = new File("").getAbsolutePath();
//        System.out.println(basePath);
        session = getSession();
        Scanner sc = new Scanner(new File("BackendServer/src/main/resources/data.tsv"));
        if (sc.hasNextLine()) sc.nextLine();
        while (sc.hasNextLine()) {
            insertCompany(new ArrayList<>(Arrays.asList(sc.nextLine().split("\t"))));
        }
        session.disconnect();
        session.close();
        System.out.println("finished");
    }

    public static void insertCompany(ArrayList<String> data) {
        while (data.size() < 20) {
            data.add("");
        }

        String name = data.get(0);
        session.beginTransaction();

        Company company = new Company(name);
        company.setContact(String.format("Keine Angabe"));
        company.setHomepage(String.format("Keine Angabe"));
        company.setAddress(String.format("%s", data.get(3)));
        company.setCeo(String.format("Keine Angabe"));
        company.setPhonenumber(String.format("Keine Angabe"));
        company.setSectors(Collections.singletonList(String.format("Keine Angabe")));
        company.setHomepage(String.format("Keine Angabe"));
        company.setInfo(String.format(
                "Später wird hier ein Beschreibungstext der Firma %s stehen, den ein Mitarbeiter zusammen mit anderen Daten verwaltet. Weiter unten sind zuerst Kontaktdaten zu finden. Dann stehen dort auch noch die Umweltkennzahlen aller Jahresberichte, die von der Firma vorliegen.",
                name));
        Report report = new Report();
        report.setCompany(company);
        System.out.println(data.get(0));
        if (!data.get(4).isEmpty()) report.setYear(Year.parse(data.get(4)));
        if (!data.get(1).isEmpty()) report.setEmployees(Long.parseLong(data.get(1)));
        else report.setEmployees(-1L);
        if (!data.get(2).isEmpty()) report.setRevenue(Float.parseFloat(data.get(2)));
        else report.setRevenue(-1f);
        if (!data.get(3).isEmpty()) company.setHeadquarters(data.get(3));
        else company.setHeadquarters("k. A.");
        if (!data.get(5).isEmpty()) company.setSectors(Collections.singletonList(data.get(5)));
        else company.setSectors(Collections.singletonList("k. A."));
        if (!data.get(6).isEmpty()) company.setEmas3(getBool(data.get(6)));
        else company.setEmas3(false);
        if (!data.get(7).isEmpty()) company.setIso14001(getBool(data.get(7)));
        else company.setIso14001(false);
        if (!data.get(8).isEmpty()) company.setIso45001(getBool(data.get(8)));
        else company.setIso45001(false);
        if (!data.get(9).isEmpty()) company.setIso50001(getBool(data.get(9)));
        else company.setIso50001(false);
        if (!data.get(10).isEmpty()) company.setIso9001(getBool(data.get(10)));
        else company.setIso9001(false);
        if (!data.get(11).isEmpty()) report.setEnergyConsumption(Float.parseFloat(data.get(11).replace(",", ".")));
        else report.setEnergyConsumption(null);
        if (!data.get(12).isEmpty()) report.setGasConsumption(Float.parseFloat(data.get(12).replace(",", ".")));
        else report.setGasConsumption(null);
        if (!data.get(13).isEmpty()) report.setElectricityConsumption(Float.parseFloat(data.get(13).replace(",", ".")));
        else report.setElectricityConsumption(null);
        if (!data.get(14).isEmpty()) report.setWaterConsumption(Float.parseFloat(data.get(14).replace(",", ".")));
        else report.setWaterConsumption(null);
        if (!data.get(15).isEmpty()) report.setDangerousWaste(Float.parseFloat(data.get(15).replace(",", ".")));
        else report.setDangerousWaste(null);
        if (!data.get(16).isEmpty()) report.setNormalWaste(Float.parseFloat(data.get(16).replace(",", ".")));
        else report.setNormalWaste(null);
        if (!data.get(17).isEmpty()) report.setCO2Emissions(Float.parseFloat(data.get(17).replace(",", ".")));
        else report.setCO2Emissions(null);
        if (!data.get(18).isEmpty()) report.setResourcesInput(Float.parseFloat(data.get(18).replace(",", ".")));
        else report.setResourcesInput(null);
        if (!data.get(19).isEmpty()) report.setResourcesOutput(Float.parseFloat(data.get(19).replace(",", ".")));
        else report.setResourcesOutput(null);

        logger.info(String.format("Inserted Report {} for company {}", report, data.get(0)));

        session.save(report);
        session.save(company);

        logger.info(String.format("inserted company %s", name));
        session.getTransaction().commit();
    }

    public static Boolean getBool(String x) {
        if (x.equalsIgnoreCase("X")) {
            return true;
        }
        return false;
    }

    public static Session getSession() {
        Map<String, String> env = System.getenv();
        Map<String, Object> configOverrides = new HashMap<String, Object>();

        configOverrides.put("javax.persistence.jdbc.url", "jdbc:postgresql://localhost:9092/compose-postgres");
        configOverrides.put("javax.persistence.jdbc.user", "compose-postgres");
        configOverrides.put("javax.persistence.jdbc.password", "compose-postgres");
        configOverrides.put("javax.persistence.schema-generation.database.action", "drop-and-create");

        return (Session) Persistence.createEntityManagerFactory("persistence-unit",
                configOverrides).createEntityManager().getDelegate();
    }
}
