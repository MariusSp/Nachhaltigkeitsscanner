package de.uniwue.nachhaltigkeitsscanner;

import de.uniwue.nachhaltigkeitsscanner.entities.Company;
import de.uniwue.nachhaltigkeitsscanner.utils.HibernateUtils;
import org.hibernate.Session;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RequestParam;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@SpringBootApplication
@ComponentScan(basePackages = {
        "de.uniwue.nachhaltigkeitsscanner.controllers",
        "de.uniwue.nachhaltigkeitsscanner.utils"
})
public class NachhaltigkeitsscannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(NachhaltigkeitsscannerApplication.class, args);
    }

}
