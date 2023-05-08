package de.uniwue.nachhaltigkeitsscanner.entities;


import com.sun.istack.NotNull;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.time.Year;


@Entity
@Transactional
@Table(name = "report")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @Column(updatable = false, nullable = false)
    private Long id;

    //Alternative Primary Key: There should only be one report per company and year
    @ManyToOne
    @NotNull
    private Company company; //companyId
    private Year year;

    private Long employees;
    private Float revenue;

    private Float energyConsumption;
    private Float gasConsumption;
    private Float electricityConsumption;
    private Float waterConsumption;
    private Float dangerousWaste;
    private Float normalWaste;
    private Float CO2Emissions;
    private Float resourcesInput;
    private Float resourcesOutput;

    public Report(Company company, Year year, Long employees, Float revenue, Float energyConsumption,
                  Float gasConsumption, Float electricityConsumption, Float waterConsumption, Float dangerousWaste,
                  Float normalWaste, Float CO2Emissions, Float resourcesInput, Float resourcesOutput) {
        this.company = company;
        this.year = year;
        this.employees = employees;
        this.revenue = revenue;
        this.energyConsumption = energyConsumption;
        this.gasConsumption = gasConsumption;
        this.electricityConsumption = electricityConsumption;
        this.waterConsumption = waterConsumption;
        this.dangerousWaste = dangerousWaste;
        this.normalWaste = normalWaste;
        this.CO2Emissions = CO2Emissions;
        this.resourcesInput = resourcesInput;
        this.resourcesOutput = resourcesOutput;
    }

    public Report(Company company, Year year) {
        this.company = company;
        this.year = year;
    }

    public Report() {
    }

    public Long getEmployees() {
        return employees;
    }

    public void setEmployees(Long employees) {
        this.employees = employees;
    }

    public Float getRevenue() {
        return revenue;
    }

    public void setRevenue(Float revenue) {
        this.revenue = revenue;
    }

    public void setEnergyConsumption(Float energyConsumption) {
        this.energyConsumption = energyConsumption;
    }

    public void setGasConsumption(Float gasConsumption) {
        this.gasConsumption = gasConsumption;
    }

    public Float getElectricityConsumption() {
        return electricityConsumption;
    }

    public void setElectricityConsumption(Float electricityConsumption) {
        this.electricityConsumption = electricityConsumption;
    }

    public void setWaterConsumption(Float waterConsumption) {
        this.waterConsumption = waterConsumption;
    }

    public Float getDangerousWaste() {
        return dangerousWaste;
    }

    public void setDangerousWaste(Float dangerousWaste) {
        this.dangerousWaste = dangerousWaste;
    }

    public Float getNormalWaste() {
        return normalWaste;
    }

    public void setNormalWaste(Float normalWaste) {
        this.normalWaste = normalWaste;
    }

    public Float getCO2Emissions() {
        return CO2Emissions;
    }

    public void setCO2Emissions(Float CO2Emissions) {
        this.CO2Emissions = CO2Emissions;
    }

    public Float getResourcesInput() {
        return resourcesInput;
    }

    public void setResourcesInput(Float resourcesInput) {
        this.resourcesInput = resourcesInput;
    }

    public Float getResourcesOutput() {
        return resourcesOutput;
    }

    public void setResourcesOutput(Float resourcesOutput) {
        this.resourcesOutput = resourcesOutput;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Year getYear() {
        return this.year;
    }

    public void setYear(Year year) {
        this.year = year;
    }

    public Float getEnergyConsumption() {
        return this.energyConsumption;
    }

    public Float getGasConsumption() {
        return this.gasConsumption;
    }

    public Float getWaterConsumption() {
        return this.waterConsumption;
    }


    @Override
    public String toString() {
        return "{" + " id='" + getId() + "'" + ", company='" + getCompany() + "'" + ", year='" + getYear() + "'" + ", energyConsumption='" + getEnergyConsumption() + "'" + ", gasConsumption='" + getGasConsumption() + "'" + ", waterConsumption='" + getWaterConsumption() + "'" + "}";
    }

}
