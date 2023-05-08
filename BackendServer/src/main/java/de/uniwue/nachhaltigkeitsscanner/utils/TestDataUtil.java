package de.uniwue.nachhaltigkeitsscanner.utils;

import de.uniwue.nachhaltigkeitsscanner.entities.Company;
import de.uniwue.nachhaltigkeitsscanner.entities.Report;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Persistence;
import javax.persistence.criteria.CriteriaQuery;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

public class TestDataUtil {
    private static final Logger logger = LoggerFactory.getLogger(TestDataUtil.class);

    private static Session session;
    private static String[] sectors = {"Baubranche", "Sanitär und Heizung", "Fahrzeugbau", "Verpackung",
            "Medizintechnik"};

    public static void main(String[] args) {
        session = getSession();
        insertCompanies(10);
        insertReportsForCompanies(2011);
        session.disconnect();
        System.out.println("finished");
    }

    private static void insertCompanies(int number) {

        Random random = new Random();
        for (int i = 0; i < number; i++) {
            String s = "";
            for (int j = 0; j < 3; j++) {
                s += Character.toString((char) random.nextInt(26) + 65);
            }
            String phone = "";
            for (int j = 0; j < 12; j++) {
                phone += random.nextInt(10);
                if (j == 4) {
                    phone += " ";
                }
            }
            String name = "company" + s;
            session.beginTransaction();

            Company company = new Company(name);
            company.setContact(String.format("%s@%s.de", name, name));
            company.setHomepage(String.format("www.%s.de", name));
            String info = "";
            for (int j = 0; j < 5; j++) {
                info += String.format("Hallo wir sind %s. ", name);
            }
            company.setInfo(info);
            company.setCeo("Max Mustermann");
            company.setPhonenumber(phone);
            company.setAddress(String.format("%s Straße %d, %d %shausen", name, random.nextInt(90) + 1,
                    9000 + random.nextInt(1000), name));
            company.setSectors(Arrays.stream(sectors).filter(e -> Math.random() < 0.1).collect(Collectors.toList()));
            if (company.getSectors().size() == 0) {
                company.getSectors().add(sectors[random.nextInt(sectors.length)]);
            }

            if (i == 0) {
                company.setUserId("3c56c8c4-5034-4749-aedc-a6461e4779bb");
            }

            session.save(company);

            logger.info(String.format("inserted company %s", name));
            session.getTransaction().commit();

        }


    }

    private static void insertReportsForCompanies(int sinceYear) {
        session.beginTransaction();

        CriteriaQuery<Company> cq = session.getCriteriaBuilder().createQuery(Company.class);
        cq.from(Company.class);
        List<Company> result = session.createQuery(cq).getResultList();

        Random random = new Random();
        for (Company c : result) {
            for (int i = sinceYear; i <= 2021; i++) {
                Report r = new Report();
                r.setEnergyConsumption((float) random.nextInt(100000));
                r.setGasConsumption((float) random.nextInt(100000));
                r.setWaterConsumption((float) random.nextInt(100000));
                r.setCO2Emissions((float) random.nextInt(100000));
                r.setNormalWaste((float) random.nextInt(100000));
                r.setResourcesOutput((float) random.nextInt(100000));
                r.setResourcesInput((float) random.nextInt(100000));
                r.setEmployees((long) random.nextInt(100000));
                r.setRevenue((float) random.nextInt(100000));
                r.setYear(Year.of(i));
                r.setCompany(c);

                session.save(r);

                logger.info(String.format("Inserted Report {} for company {}", r, c));
            }
        }
        session.getTransaction().commit();
    }

    public static List<Company> findAllCompanies() {
        Session session = getSession();
        CriteriaQuery<Company> c = session.getCriteriaBuilder().createQuery(Company.class);
        c.from(Company.class);
        List<Company> result = session.createQuery(c).getResultList();
        session.disconnect();
        return result;
    }

    private static Session getSession() {
        Map<String, Object> configOverrides = new HashMap<String, Object>();

        configOverrides.put("javax.persistence.jdbc.url", "jdbc:postgresql://localhost:9092/compose-postgres");
        configOverrides.put("javax.persistence.jdbc.user", "compose-postgres");
        configOverrides.put("javax.persistence.jdbc.password", "compose-postgres");
        configOverrides.put("javax.persistence.schema-generation.database.action", "drop-and-create");

        return (Session) Persistence.createEntityManagerFactory("persistence-unit",
                configOverrides).createEntityManager().getDelegate();
    }
}
