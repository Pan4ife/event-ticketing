package io.github.pan4ife.eventticketing;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_USE_FIELD_INJECTION;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

/**
 * Layer rules from AGENTS.md, checked on every `./mvnw verify`.
 * Packages are matched by name anywhere in the tree, so both `controller/` and `booking/controller/` work.
 */
@AnalyzeClasses(packages = "io.github.pan4ife.eventticketing", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

    @ArchTest
    static final ArchRule controllers_do_not_use_repositories = noClasses()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("..repository..")
            .because("controllers call services; services own data access");

    @ArchTest
    static final ArchRule controllers_do_not_expose_entities = noClasses()
            .that()
            .resideInAPackage("..controller..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("..domain..")
            .because("the API speaks DTOs, entities stay inside the service layer");

    @ArchTest
    static final ArchRule services_do_not_know_controllers = noClasses()
            .that()
            .resideInAPackage("..service..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("..controller..");

    @ArchTest
    static final ArchRule repositories_do_not_know_upper_layers = noClasses()
            .that()
            .resideInAPackage("..repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..service..", "..controller..");

    @ArchTest
    static final ArchRule domain_does_not_know_upper_layers = noClasses()
            .that()
            .resideInAPackage("..domain..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..dto..", "..service..", "..controller..", "..repository..");

    @ArchTest
    static final ArchRule constructor_injection_only = NO_CLASSES_SHOULD_USE_FIELD_INJECTION;

    @ArchTest
    static final ArchRule no_system_out = NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;
}
