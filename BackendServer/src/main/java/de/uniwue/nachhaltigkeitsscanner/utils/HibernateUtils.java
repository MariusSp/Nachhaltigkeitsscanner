package de.uniwue.nachhaltigkeitsscanner.utils;

import org.hibernate.Session;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.HashMap;
import java.util.Map;

@Component
public final class HibernateUtils {
    private static final String PERSISTANCE_UNIT_NAME = "persistence-unit";
    private static EntityManager EM = install();

    private static EntityManager install() {
        Map<String, String> env = System.getenv();
        Map<String, Object> configOverrides = new HashMap<String, Object>();

        configOverrides.put("javax.persistence.jdbc.url", env.get("DATASOURCE_URL"));
        configOverrides.put("javax.persistence.jdbc.user", env.get("DATASOURCE_USERNAME"));
        configOverrides.put("javax.persistence.jdbc.password", env.get("DATASOURCE_PASSWORD"));
        configOverrides.put("javax.persistence.schema-generation.database.action", env.get("DATASOURCE_SCHEMA_GENERATION"));

        return Persistence.createEntityManagerFactory(PERSISTANCE_UNIT_NAME, configOverrides).createEntityManager();
    }

    private HibernateUtils() {
    }


    public static EntityManager getEM() {
        return EM;
    }

    public static Session getSession() {
        return (Session) EM.getDelegate();
    }
}
