package de.uniwue.nachhaltigkeitsscanner.controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import de.uniwue.nachhaltigkeitsscanner.entities.Company;
import de.uniwue.nachhaltigkeitsscanner.entities.Company_;
import de.uniwue.nachhaltigkeitsscanner.entities.Report;
import de.uniwue.nachhaltigkeitsscanner.entities.Report_;
import de.uniwue.nachhaltigkeitsscanner.utils.CompanyUtils;
import de.uniwue.nachhaltigkeitsscanner.utils.HibernateUtils;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/reports")
public class ReportRest {
    private static final Logger logger = LoggerFactory.getLogger(ReportRest.class);


    public ReportRest() {
    }

    @GetMapping()
    public List<Report> getAllReports() {

        Session session = HibernateUtils.getSession();
        CriteriaQuery<Company> c = session.getCriteriaBuilder().createQuery(Company.class);
        c.from(Company.class);
        List<Company> companies = session.createQuery(c).getResultList();

        List<Report> reports = companies.stream().map(company -> {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Report> cq = cb.createQuery(Report.class);
            Root<Report> root = cq.from(Report.class);
            Predicate condition = cb.equal(root.get(Report_.company), company);
            cq.where(condition).orderBy(cb.desc(root.get(Report_.year)));
            List<Report> results = HibernateUtils.getEM().createQuery(cq).getResultList();
            return results.size() > 0 ? results.get(0) : null;
        }).filter(r -> r != null).collect(Collectors.toList());
        return reports;
    }

    @GetMapping("/{companyID}")
    public List<Report> getReportsForCompany(@PathVariable String companyID) {
        Assert.notNull(companyID);

        Session session = HibernateUtils.getSession();
        CriteriaBuilder qb = session.getCriteriaBuilder();
        CriteriaQuery<Report> c = qb.createQuery(Report.class);
        Root<Report> root = c.from(Report.class);

        Predicate condition = qb.equal(root.get(Report_.company).get(Company_.id), companyID);
        c.where(condition);
        TypedQuery<Report> tq = HibernateUtils.getEM().createQuery(c);
        return tq.getResultList();
    }

    @GetMapping("/{companyID}/{year}")
    public List<Report> getReportByYearByCompany(@PathVariable String companyID, @PathVariable int year) {
        Assert.notNull(companyID);

        Session session = HibernateUtils.getSession();
        CriteriaBuilder qb = session.getCriteriaBuilder();
        CriteriaQuery<Report> c = qb.createQuery(Report.class);
        Root<Report> root = c.from(Report.class);

        Predicate[] conditions = new Predicate[2];
        conditions[0] = qb.equal(root.get(Report_.company).get(Company_.id), companyID);
        conditions[1] = qb.equal(root.get(Report_.year), Year.of(year));
        c.where(conditions);
        TypedQuery<Report> tq = HibernateUtils.getEM().createQuery(c);
        return tq.getResultList();
    }

    @PostMapping("/remove")
    public Report deleteReport(@RequestBody Report report) {
        if (getReportByYearByCompany(report.getCompany().getId().toString(), report.getYear().getValue()).size() != 1) {
            logger.info(String.format("'%s'  Report not found in database", report.getId()));
            return null;
        }

        Session session = HibernateUtils.getSession();
        session.clear();
        session.getTransaction().begin();

        CriteriaBuilder qb = session.getCriteriaBuilder();
        CriteriaQuery<Report> c = qb.createQuery(Report.class);
        Root<Report> root = c.from(Report.class);

        c.where(qb.equal(root.get(Report_.id), report.getId()));
        TypedQuery<Report> tq = HibernateUtils.getEM().createQuery(c);

//        em.remove(em.contains(report) ? report : em.merge(report));
        session.remove(tq.getSingleResult());

        session.getTransaction().commit();
        return report;
    }

    @PostMapping()
    public Report insertReport(@RequestBody ObjectNode objectNode) {
        String companyId = objectNode.get("companyId").asText();
        Year year = Year.of(objectNode.get("year").asInt());
        Company company = CompanyUtils.findCompanyById(companyId);

        //Check for year is missing :.getYear().equals(year).
        Optional<Report> alreadyExists = getAllReports().stream()
                .filter(it -> it.getCompany().equals(company) && it.getYear().equals(year)).findFirst();
        if (alreadyExists.isPresent()) {
            logger.info(String.format("'%s' already exists in Database", alreadyExists.get()));
            return alreadyExists.get();
        }

        Session session = HibernateUtils.getSession();
        session.clear();
        session.getTransaction().begin();

        Report report = new Report(company, year);
        logger.info(report.toString());
        session.save(report);
        session.getTransaction().commit();

        logger.info(String.format("Inserted Report '%s' into Database", report.toString()));
        return report;
    }

    @PutMapping()
    public Report editReport(@RequestBody Report report) {
        Optional<Report> alreadyExists = getReportByYearByCompany(report.getCompany().getId().toString(),
                report.getYear().getValue()).stream()
                .filter(it -> it.getCompany().getId().equals(report.getCompany().getId())
                        && it.getYear().getValue() == report.getYear().getValue()).findFirst();
        if (alreadyExists.isEmpty()) {
            logger.info(String.format("'%s' does not exist in Database", report.getCompany().getName()));
            return null;
        }
        Session session = HibernateUtils.getSession();
        session.clear();
        session.getTransaction().begin();

        Report report_db = alreadyExists.get();
        report_db.setEmployees(report.getEmployees());
        report_db.setRevenue(report.getRevenue());
        report_db.setEnergyConsumption(report.getEnergyConsumption());
        report_db.setGasConsumption(report.getGasConsumption());
        report_db.setElectricityConsumption(report.getElectricityConsumption());
        report_db.setWaterConsumption(report.getWaterConsumption());
        report_db.setDangerousWaste(report.getDangerousWaste());
        report_db.setNormalWaste(report.getNormalWaste());
        report_db.setCO2Emissions(report.getCO2Emissions());
        report_db.setResourcesOutput(report.getResourcesOutput());
        report_db.setResourcesInput(report.getResourcesInput());

        session.update(report_db);
        session.getTransaction().commit();
        logger.info(report.toString());

        logger.info(String.format("Updated Report for company '%s' and year '%s' amount in Database",
                report.getCompany().getName(), report.getYear()));
        return report;
    }
}
